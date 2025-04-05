// src/app/api/generate/route.ts
import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { generatePrompt } from "@/lib/generatePrompt";
import { saveDailyQuestionSet } from "@/lib/saveDailyQuestion";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  try {
    // URLから各パラメータを取得
    const searchParams = req.nextUrl.searchParams;
    const mode = (searchParams.get("mode") as "count" | "word") || "count";
    const questionCount = searchParams.get("questionCount") || "5";
    const level = searchParams.get("level") || "CEFR preA1";
    const length = searchParams.get("length") || "11 to 15 words";

    // words配列を処理
    let words: string[] = [];
    const wordsParam = searchParams.get("words");
    if (wordsParam) {
      try {
        words = JSON.parse(wordsParam);
      } catch (e) {
        // パース失敗時は空配列を使用
        console.error("Failed to parse words parameter:", e);
      }
    }

    const prompt = generatePrompt({
      mode,
      words,
      questionCount,
      level,
      length,
    });

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    const encoder = new TextEncoder();
    let fullResponse = "";

    // 問題追跡用のクロージャ
    let lastSentCount = 0;
    // リクエストされた問題数を数値変換
    const requestedQuestionCount =
      mode === "word" ? words.length : parseInt(questionCount, 10);

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            fullResponse += content;

            // シンプルな手法：完成したオブジェクトを検出して送信
            // JSON文字列を直接解析するのではなく、文字単位で構造を分析

            try {
              // もっとシンプルに、現在の全応答からオブジェクトを抽出
              const responseText = fullResponse.trim();

              // 正規表現を使って完成したJSONオブジェクトを抽出
              // 個々の問題を抽出する - 深さを考慮せずに単純化
              // 最低限のJSON構造チェック：配列内の各オブジェクト
              if (responseText.indexOf("[") === 0) {
                let bracketCount = 0;
                let objectStart = -1;
                let inString = false;
                let escape = false;
                const objects = [];

                // 文字単位で解析
                for (let i = 0; i < responseText.length; i++) {
                  const char = responseText[i];

                  // 文字列内のエスケープシーケンス処理
                  if (escape) {
                    escape = false;
                    continue;
                  }

                  // バックスラッシュは次の文字をエスケープ
                  if (char === "\\") {
                    escape = true;
                    continue;
                  }

                  // 引用符の開始/終了を追跡
                  if (char === '"') {
                    inString = !inString;
                    continue;
                  }

                  // 文字列内の場合は構造解析をスキップ
                  if (inString) continue;

                  // オブジェクト検出
                  if (char === "{") {
                    if (bracketCount === 0) {
                      objectStart = i; // オブジェクト開始位置を記録
                    }
                    bracketCount++;
                  } else if (char === "}") {
                    bracketCount--;
                    if (bracketCount === 0 && objectStart !== -1) {
                      // 完全なオブジェクトを抽出
                      const objectText = responseText.substring(
                        objectStart,
                        i + 1
                      );
                      // オブジェクトを解析して配列に追加
                      const obj = JSON.parse(objectText);
                      objects.push(obj);

                      // 既に送信したオブジェクト数を超えた場合、新しいオブジェクトを送信
                      if (objects.length > lastSentCount) {
                        for (let j = lastSentCount; j < objects.length; j++) {
                          // 単一の問題を送信
                          controller.enqueue(
                            encoder.encode(
                              `data: ${JSON.stringify({
                                singleQuestion: objects[j],
                                questionIndex: j,
                                completedCount: j + 1,
                                isComplete: false,
                                debug: true, // デバッグ情報
                              })}\n\n`
                            )
                          );
                        }
                        lastSentCount = objects.length;
                      }
                      objectStart = -1; // 次のオブジェクト検索のためにリセット
                    }
                  }
                }
              }
            } catch (e) {
              console.error("JSON processing error:", e);
            }
          }

          // ストリーム終了時に完全な結果を送信
          try {
            const finalResult = JSON.parse(fullResponse.trim());

            // 問題数のチェックと対応
            if (finalResult.length < requestedQuestionCount) {
              console.log(
                `Warning: Received ${finalResult.length} questions but requested ${requestedQuestionCount}`
              );

              // 不足している問題数を計算
              const missingCount = requestedQuestionCount - finalResult.length;

              // 問題数が不足している場合、足りない分を追加生成するためのリクエスト
              if (missingCount > 0) {
                const additionalPrompt = generatePrompt({
                  mode,
                  words: mode === "word" ? words.slice(finalResult.length) : [],
                  questionCount: missingCount.toString(),
                  level,
                  length,
                });

                const additionalResponse = await openai.chat.completions.create(
                  {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: additionalPrompt }],
                  }
                );

                const additionalContent =
                  additionalResponse.choices[0].message?.content ?? "";

                try {
                  // 追加の問題を解析
                  const additionalQuestions = JSON.parse(
                    additionalContent.trim()
                  );

                  // 元の問題と追加の問題を結合
                  const combinedResult = [
                    ...finalResult,
                    ...additionalQuestions,
                  ];

                  // 最終的に結合した問題セットを送信
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        questions: combinedResult,
                        isComplete: true,
                      })}\n\n`
                    )
                  );
                } catch (e) {
                  console.error("Failed to parse additional questions:", e);
                  // 追加生成に失敗した場合は元の問題だけを返す
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        questions: finalResult,
                        isComplete: true,
                      })}\n\n`
                    )
                  );
                }
              } else {
                // 問題数が揃っている場合は通常通り返す
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      questions: finalResult,
                      isComplete: true,
                    })}\n\n`
                  )
                );
              }
            } else {
              // 問題数が揃っている場合は通常通り返す
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    questions: finalResult,
                    isComplete: true,
                  })}\n\n`
                )
              );
            }
          } catch (e) {
            console.error("Final JSON parsing error:", e);
            // 最終的なJSON解析に失敗した場合
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  error: "Invalid JSON from GPT",
                  raw: fullResponse,
                })}\n\n`
              )
            );
          }
          // fullResponse の JSON がちゃんとパースできたら
          const finalResult = JSON.parse(fullResponse.trim());

          const fixedQuestions =
            finalResult.length === 10
              ? finalResult
              : finalResult.length > 10
              ? finalResult.slice(0, 10)
              : null;

          if (fixedQuestions) {
            try {
              await saveDailyQuestionSet({
                level,
                mode,
                source_words: mode === "word" ? words : null,
                questions: fixedQuestions,
              });
              console.log("✅ 保存完了！");
            } catch (e) {
              console.error("❌ 保存失敗:", e);
            }
          } else {
            console.log("📭 保存スキップ：10問未満");
          }

          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

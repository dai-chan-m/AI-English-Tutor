// src/app/api/generate/route.ts
import { NextRequest } from "next/server";
import { getOpenAIClient } from "@/utils/openaiClient";
import { handleAPIError, createStreamResponse } from "@/utils/apiErrorHandler";
import { generatePrompt } from "@/lib/generatePrompt";
import { saveDailyQuestionSet } from "@/lib/saveDailyQuestion";

const openai = getOpenAIClient();

// JSONオブジェクト抽出のヘルパー関数
const extractJSONObjects = (responseText: string) => {
  if (responseText.indexOf("[") !== 0) return [];

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
        const objectText = responseText.substring(objectStart, i + 1);
        try {
          // オブジェクトを解析して配列に追加
          const obj = JSON.parse(objectText);
          objects.push(obj);
          objectStart = -1; // 次のオブジェクト検索のためにリセット
        } catch (e) {
          if (e instanceof SyntaxError) {
            // 解析エラーは無視して次へ
            objectStart = -1;
          }
        }
      }
    }
  }

  return objects;
};

export async function GET(req: NextRequest) {
  try {
    // URLから各パラメータを取得
    const searchParams = req.nextUrl.searchParams;
    const mode = (searchParams.get("mode") as "count" | "word") || "count";
    const questionCount = searchParams.get("questionCount") || "5";
    const level = searchParams.get("level") || "CEFR preA1";
    const length = searchParams.get("length") || "11 to 15 words";

    // 最初のバッチを指定（クエリパラメータになければ0）
    const batchIndex = parseInt(searchParams.get("batchIndex") || "0", 10);
    const totalBatchesParam = searchParams.get("totalBatches");

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

    // すでに生成された問題があれば取得
    let existingQuestions: string[] = [];
    const existingQuestionsParam = searchParams.get("existingQuestions");
    if (existingQuestionsParam) {
      try {
        existingQuestions = JSON.parse(existingQuestionsParam);
      } catch (e) {
        console.error("Failed to parse existingQuestions parameter:", e);
      }
    }

    const encoder = new TextEncoder();
    // リクエストされた問題数を数値変換
    const requestedQuestionCount =
      mode === "word" ? words.length : parseInt(questionCount, 10);

    // 5問ずつ生成するためのバッチサイズ
    const BATCH_SIZE = 5;

    // 総バッチ数を計算
    const totalBatches = totalBatchesParam
      ? parseInt(totalBatchesParam, 10)
      : Math.ceil(requestedQuestionCount / BATCH_SIZE);

    // このバッチのスタート位置とサイズを計算
    const startIndex = batchIndex * BATCH_SIZE;
    const currentBatchSize = Math.min(
      BATCH_SIZE,
      requestedQuestionCount - startIndex
    );

    // 最終バッチかどうかを判定
    const isLastBatch = batchIndex === totalBatches - 1;

    // このバッチのプロンプトを生成
    const prompt = generatePrompt({
      mode,
      words:
        mode === "word"
          ? words.slice(startIndex, startIndex + currentBatchSize)
          : [],
      questionCount: currentBatchSize.toString(),
      level,
      length,
      batchIndex,
      totalBatches,
    });

    // このバッチの問題を生成
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    let batchResponse = "";
    let lastSentCount = 0;

    return createStreamResponse(async (controller) => {
      // ストリームからのレスポンスを処理
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        batchResponse += content;

        try {
          // 現在のバッチレスポンスからオブジェクトを抽出
          const responseText = batchResponse.trim();
          const objects = extractJSONObjects(responseText);

          // 新しいオブジェクトがあれば送信
          if (objects.length > lastSentCount) {
            for (let j = lastSentCount; j < objects.length; j++) {
              const globalIndex = startIndex + j;
              // 単一の問題を送信
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    singleQuestion: objects[j],
                    questionIndex: globalIndex,
                    completedCount: existingQuestions.length + j + 1,
                    isComplete: false,
                    totalExpected: requestedQuestionCount,
                    currentBatch: batchIndex + 1,
                    totalBatches: totalBatches,
                    batchProgress: j + 1,
                    batchSize: currentBatchSize,
                  })}\n\n`
                )
              );
            }
            lastSentCount = objects.length;
          }
        } catch (e) {
          console.error("JSON processing error:", e);
        }
      }

      // このバッチの結果をパース
      try {
        const batchQuestions = JSON.parse(batchResponse.trim());
        // 既存の問題と合わせた問題リスト
        const allQuestions = [...existingQuestions, ...batchQuestions];

        console.log(
          `Batch ${batchIndex + 1}/${totalBatches} completed: ${
            batchQuestions.length
          } questions`
        );

        // バッチの状態を送信
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              batchComplete: true,
              batchIndex: batchIndex,
              batchQuestions: batchQuestions,
              nextBatchIndex: batchIndex + 1,
              isLastBatch: isLastBatch,
              totalGenerated: allQuestions.length,
              totalRequested: requestedQuestionCount,
              totalBatches: totalBatches,
            })}\n\n`
          )
        );

        // 最終バッチなら最終結果も送信
        if (isLastBatch) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                questions: allQuestions,
                isComplete: true,
                totalGenerated: allQuestions.length,
                totalRequested: requestedQuestionCount,
              })}\n\n`
            )
          );

          // データベースへの保存処理（最終バッチのみ）
          const fixedQuestions =
            allQuestions.length === 10
              ? allQuestions
              : allQuestions.length > 10
              ? allQuestions.slice(0, 10)
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
        }
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.error(
            `Failed to parse batch ${batchIndex + 1} questions:`,
            e
          );
          // エラーが発生した場合
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: "問題の生成に失敗しました。再試行してください。",
                errorDetail: e.message,
                rawResponse: batchResponse,
                batchIndex: batchIndex,
              })}\n\n`
            )
          );
        }
      }

      controller.close();
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

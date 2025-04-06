// src/app/api/generate/writing/route.ts
import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { saveWritingPrompt } from "@/lib/saveWritingPrompt";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 既存のすべてのトピックを取得する関数
async function getAllExistingTopics() {
  const { data, error } = await supabase
    .from("daily_writing")
    .select("topic");

  if (error) {
    console.error("Error fetching existing topics:", error);
    return [];
  }

  return data.map(item => item.topic);
}

// 指定されたレベルからランダムなトピックをDBから取得する関数
async function getRandomTopic(level?: string) {
  try {
    let query = supabase
      .from("daily_writing")
      .select("id, level, topic, model_answer, japanese_explanation")
      .order("id", { ascending: false })
      .limit(50);  // 最新50件から選択
    
    // レベルが指定されている場合はフィルタリング
    if (level) {
      query = query.eq("level", level);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching topics:", error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // ランダムなインデックスを生成
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (error) {
    console.error("Error getting random topic:", error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // URLから各パラメータを取得
    const searchParams = req.nextUrl.searchParams;
    const level = searchParams.get("level") || "CEFR A2–B1";
    const isAdmin = searchParams.get("isAdmin") === "true";
    const isRandom = searchParams.get("random") === "true";
    
    // 管理者で無い場合またはランダムリクエストの場合、既存トピックからランダムに返す
    if (!isAdmin || isRandom) {
      const randomTopic = await getRandomTopic(isRandom ? level : undefined);
      
      if (!randomTopic) {
        return NextResponse.json(
          { 
            error: "No topics found", 
            message: level ? `No writing topics available for level ${level}` : "No writing topics available in the database" 
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        ...randomTopic
      });
    }

    // 管理者の場合は新しいトピックを生成
    const existingTopics = await getAllExistingTopics();

    // お題生成用プロンプト
    const topicPrompt = `
    あなたはTOEFL、IELTS、英検などの試験に精通した英語教師です。
    選択されたレベル（${level}）に適した英作文のお題（トピック）を1つ生成してください。

    以下の条件に従ってください：
    - レベル: ${level}
    - お題は150〜250字で書ける内容にする
    - 一般的で取り組みやすいトピックにする
    - 政治的・宗教的に偏ったトピックは避ける
    - 複雑過ぎず、シンプルすぎない適切な難易度にする
    - 以下の既存トピックとは異なる内容にする:
    ${existingTopics.slice(0, 10).map(topic => `"${topic}"`).join("\n")}
    
    トピックのみを出力してください。説明や補足は不要です。
    英語で出力してください。
    `;

    // トピック生成
    const topicResponse = await openai.chat.completions.create({
      model: "gpt-4o",  // GPT-4を使用してより高品質なトピックを生成
      messages: [{ role: "user", content: topicPrompt }],
    });

    const topic = topicResponse.choices[0].message.content?.trim() || "";

    // 日本語説明の生成
    const japaneseExplanationPrompt = `
    あなたは英日翻訳のプロフェッショナルです。以下の英作文トピックを自然な日本語に翻訳してください。
    
    英文トピック: "${topic}"
    
    翻訳の際の注意点:
    - 直訳ではなく、日本語として自然な表現を使用してください
    - 専門用語や固有名詞は適切に処理してください
    - 原文のニュアンスや意図を正確に伝えることを心がけてください
    - 日本語として違和感のない、流暢な表現を使ってください
    - 中学生や高校生にも分かりやすい表現を心がけてください
    
    日本語での説明のみを出力してください。翻訳過程や追加の解説は不要です。
    `;

    const japaneseExplanationResponse = await openai.chat.completions.create({
      model: "gpt-4o",  // GPT-4を使用してより高品質な翻訳を生成
      messages: [{ role: "user", content: japaneseExplanationPrompt }],
    });

    const japaneseExplanation =
      japaneseExplanationResponse.choices[0].message.content?.trim() || "";

    // 模範解答生成用プロンプト
    const modelAnswerPrompt = `
    あなたは英作文の専門家です。以下のトピックに対する模範解答を書いてください。

    トピック: "${topic}"

    以下の条件に従ってください：
    - レベル: ${level}に厳密に適合した語彙、文法、表現のみを使用する
    - ${level}の学習者が理解できる単語と表現だけを使用する
    - 英検/TOEICで想定される${level}の難易度に合わせる
    - レベルに応じた語数で書く
    - 論理的な構成（introduction, body, conclusion）で書く
    - 読みやすく明確な文章にする
    
    レベル別の特徴：
    - CEFR A1以下: 非常に基本的な単語と単純な文構造のみ使用（現在形中心、接続詞はandとbut程度）
    - CEFR A1-A2: 基本的な日常表現と簡単な構文のみ使用（現在形・過去形、簡単な接続詞）
    - CEFR A2-B1: 日常的な表現と基本的な複文構造まで使用可能（現在・過去・未来形、基本的な接続詞）
    - CEFR B1-B2: より複雑な文構造と抽象的な表現も適度に使用（各種時制、関係詞、仮定法も基本的なもの）
    - CEFR B2-C1: 複雑な構文や専門的な語彙も適切に使用（高度な時制表現、様々な接続表現、慣用句）
    - TOEIC向け: ビジネスやオフィス関連の語彙を適切に取り入れる

    模範解答のみを出力してください。追加の解説は不要です。
    `;

    // 模範解答生成
    const modelAnswerResponse = await openai.chat.completions.create({
      model: "gpt-4o",  // GPT-4を使用してより高品質な模範解答を生成
      messages: [{ role: "user", content: modelAnswerPrompt }],
    });

    const modelAnswer =
      modelAnswerResponse.choices[0].message.content?.trim() || "";

    // データベースに保存
    try {
      const id = await saveWritingPrompt({
        level,
        topic,
        model_answer: modelAnswer,
        japanese_explanation: japaneseExplanation,
      });

      return NextResponse.json({
        success: true,
        id,
        level,
        topic,
        model_answer: modelAnswer,
        japanese_explanation: japaneseExplanation,
      });
    } catch (error) {
      console.error("Error saving to database:", error);
      return NextResponse.json(
        {
          error: "Database Error",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
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

// src/app/api/feedback/route.ts
import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { text, tone } = await req.json();
  let toneInstruction = "";

  switch (tone) {
    case "gentle":
      toneInstruction =
        "中学生にもわかるように、やさしく丁寧に説明してください。";
      break;
    case "strict":
      toneInstruction = "正確さを重視し、論理的かつ簡潔に指摘してください。";
      break;
    case "friendly":
      toneInstruction =
        "友達にアドバイスするような、やさしくカジュアルな口調で説明してください。いいところを褒めまくってください。";
      break;
    case "business":
      toneInstruction =
        "フォーマルで丁寧な言葉を使い、社会人向けに明確なフィードバックをしてください。";
      break;
  }

  const prompt = `
あなたは日本人中学生向けの英語教師です。

以下の英作文について、文を一文ずつ取り出し、次の形式で添削・フィードバックしてください。

出力形式（繰り返してください）：
---
✏️ あなたの文: [生徒の元の1文]
🧑‍🏫 添削後の文: [文法・語彙・自然さを考慮した正しい英文]

💡 フィードバック: 
[${toneInstruction}]
---

最後に、以下の観点で英作文全体の総合評価コメントを追加してください：
- 構成やまとまり（Introduction, Body, Conclusionなど）
- 論理的な流れやつながり
- 語彙や表現の幅、適切さ
- 読み手への伝わりやすさ

以下のように出力してください：

📝 全体講評:
[中学生にもわかる日本語でコメントを記載]

【英作文】  
${text}

⚠️ 注意事項：
- 文を分割して一文ずつ添削してください（文が長い場合も適切に分けて）
- 全体ではなく、各文ごとに丁寧に修正＆コメントしてください
- 丁寧でやさしい日本語で書いてください（中学生が読む前提）

`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = response.choices[0].message?.content ?? "";

    return NextResponse.json({ feedback: reply });
  } catch (error) {
    console.error("GPT Feedback Error:", error);
    return NextResponse.json(
      { error: "添削に失敗しました。" },
      { status: 500 }
    );
  }
}

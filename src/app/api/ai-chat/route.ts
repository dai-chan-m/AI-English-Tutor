// src/app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, handleAPIError } from "@/utils/openaiClient";

const openai = getOpenAIClient();

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages missing or malformed" },
        { status: 400 }
      );
    }

    const prompt = systemPrompt.trim() + "全て英語で回答します。";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }, ...messages],
      temperature: 0.7,
    });

    const reply = response.choices[0].message?.content?.trim();

    return NextResponse.json({
      success: true,
      reply: reply ?? "Sorry, I couldn't respond.",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

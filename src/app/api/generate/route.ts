// src/app/api/generate/route.ts
import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { generatePrompt } from "@/lib/generatePrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { mode, words, questionCount, level, length } = await req.json();

    const prompt = generatePrompt({
      mode,
      words,
      questionCount,
      level,
      length,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message?.content ?? "";

    try {
      const parsed = JSON.parse(result);
      return NextResponse.json({ questions: parsed });
    } catch (e) {
      if (e instanceof SyntaxError) {
        return NextResponse.json(
          { error: "Invalid JSON from GPT", raw: result },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Internal Server Error", message: error.message },
        { status: 500 }
      );
    }
  }
}

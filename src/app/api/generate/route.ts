// src/app/api/generate/route.ts
import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { questionCount, level, length } = await req.json();

    const prompt = `
  Create multiple-choice English fill-in-the-blank questions based on the following conditions.
  
  ---
  
  🔹 Question Specifications:
  
  - Total number of questions: ${questionCount}
  - Each question must include:
    - One sentence with a single blank (use "____")
    - Exactly four choices (A to D), one of which is the correct answer
    - The correct answer must match the intended vocabulary target (no inflections or conjugations)
  
  ---
  
  🔹 Language Level:
  
  - Grade: ${level}
  - Question words: ${length}
   - Each question must be **a complete sentence or a pair of connected sentences** that work together as one idea.
  
  ---
  
  🔹 Vocabulary & Grammar Restrictions:
  
  - Use **only vocabulary and grammar commonly taught at the level of ${level}.
  - ❌ Avoid all idiomatic, abstract, or academic words beyond the level of ${level}.
  - ⚠️ If any part of the sentence exceeds the level of ${level}, the entire output is invalid.
  
  ---
  
  🔹 Output Format Instructions:
  
  - Format each question as shown in the example below
  - Provide the output in **JSON array format** as shown
  
  ✅ Example:
  
  [
    {
    "word": "compensate",
    "question": "The company decided to ____ the customers after the service outage.",
    "choices": ["punish", "compensate", "remove", "decline"],
    "answer": "compensate",
    "explanation_ja": "「compensate」は「補償する」という意味。",
    "Japanese": "「会社はサービスの停止後に顧客に補償することを決定した。」"
    },
  ]
  
  ---
  
  🔹 Output Rules:
  
  - Only generate the questions in the JSON format above.
  - Do not include explanations, introductions, or additional comments.
  - Ensure the question content is **fully appropriate for the specified level of ${level}.
  - Ensure the length of the sentences is appropriate for the specified length of ${length}.
  ${
    level.includes("TOEIC")
      ? "Use CEFR-aligned business vocabulary and situations (e.g., email, scheduling, meetings)."
      : ""
  }
  - Only one of the choices must be clearly and naturally correct in both grammar and meaning.
  - Other choices must be grammatically correct but contextually wrong or unnatural.
  - Do not include multiple answers that could make sense (e.g., both "big" and "small" for a cake).
  - Do NOT create questions that rely on personal preferences or opinions (e.g., favorite food, color, hobby).
  - All questions must have only one objectively correct answer based on grammar and context.
  - Distractors must NOT be plausible alternatives.
  - At least two incorrect choices must feel clearly unnatural or incorrect in the sentence.
  - The sentence must support only ONE best answer.
  - Avoid overly generic patterns like "can ___ well" unless the verb choice makes a clear difference.

  Each output item must include the following fields:
  - word
  - question
  - choices (array of 4 items)
  - answer (exact match)
  - explanation_ja (a brief explanation in Japanese, about why the answer is correct)
  - Japanese (the Japanese translation of the question)

⚠️ If any field is missing, the output is invalid.
  
  Start now.
  `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message?.content ?? "";

    try {
      const parsed = JSON.parse(result);
      return NextResponse.json({ questions: parsed });
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON from GPT", raw: result },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || error },
      { status: 500 }
    );
  }
}

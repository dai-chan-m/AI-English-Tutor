// lib/saveDailyQuestion.ts
import { supabaseServer, getNextId } from "@/utils/supabaseServer";

type SaveParams = {
  level: string;
  mode: "count" | "word";
  source_words: string[] | null;
  questions: {
    question: string;
    choices: string[];
    answer: string;
    explanation_ja: string;
    Japanese?: string;
  }[];
};

export async function saveDailyQuestionSet(params: SaveParams) {
  const { level, mode, source_words, questions } = params;
  
  // 共通ユーティリティを使用して次のページ番号を取得
  const nextPageNumber = await getNextId("daily_questions", "page_number");

  const { error } = await supabaseServer().from("daily_questions").insert({
    page_number: nextPageNumber,
    level,
    mode,
    source_words,
    questions,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error("Failed to save question set to DB");
  }

  return nextPageNumber; // 必要なら返す（例：リダイレクトに使うとか）
}

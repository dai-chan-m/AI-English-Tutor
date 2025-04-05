// lib/saveDailyQuestion.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
  // 最新の page_number を取得して +1
  const { data, error: selectError } = await supabase
    .from("daily_questions")
    .select("page_number")
    .order("page_number", { ascending: false })
    .limit(1);

  if (selectError) {
    console.error("Failed to fetch latest page_number:", selectError);
    throw new Error("Could not determine next page number");
  }

  const nextPageNumber = (data?.[0]?.page_number ?? 0) + 1;

  const { error } = await supabase.from("daily_questions").insert({
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

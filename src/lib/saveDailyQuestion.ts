// lib/saveDailyQuestion.ts
import { insertWithNextId } from "@/utils/supabaseHelpers";

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
  
  // 共通ヘルパー関数を使用してデータを挿入
  const result = await insertWithNextId(
    "daily_questions",
    { level, mode, source_words, questions },
    "page_number"
  );

  if (result.error) {
    console.error("Failed to save question set:", result.error);
    throw result.error;
  }

  // 最初のレコードのpage_numberを返す（テーブルには1つのレコードだけ挿入される）
  return result.data && Array.isArray(result.data) && result.data.length > 0
    ? result.data[0].page_number
    : null;
}

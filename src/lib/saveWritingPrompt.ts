// lib/saveWritingPrompt.ts
import { insertWithNextId } from "@/utils/supabaseHelpers";

type SaveWritingPromptParams = {
  level: string;
  topic: string;
  model_answer: string;
  japanese_explanation: string;
};

export async function saveWritingPrompt(params: SaveWritingPromptParams) {
  const { level, topic, model_answer, japanese_explanation } = params;
  
  // 共通ヘルパー関数を使用してデータを挿入
  const result = await insertWithNextId(
    "daily_writing",
    {
      level,
      topic,
      model_answer,
      japanese_explanation,
      created_at: new Date().toISOString(),
    },
    "id"
  );

  if (result.error) {
    console.error("Failed to save writing prompt:", result.error);
    throw result.error;
  }

  // 最初のレコードのIDを返す（テーブルには1つのレコードだけ挿入される）
  return result.data && Array.isArray(result.data) && result.data.length > 0
    ? result.data[0].id
    : null;
}
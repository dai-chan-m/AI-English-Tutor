// lib/saveWritingPrompt.ts
import { supabaseServer, getNextId } from "@/utils/supabaseServer";

type SaveWritingPromptParams = {
  level: string;
  topic: string;
  model_answer: string;
  japanese_explanation: string;
};

export async function saveWritingPrompt(params: SaveWritingPromptParams) {
  const { level, topic, model_answer, japanese_explanation } = params;
  
  // 共通ユーティリティを使用して次のIDを取得
  const nextId = await getNextId("daily_writing", "id");

  const { error } = await supabaseServer().from("daily_writing").insert({
    id: nextId,
    level,
    topic,
    model_answer,
    japanese_explanation,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error("Failed to save writing prompt to DB");
  }

  return nextId;
}
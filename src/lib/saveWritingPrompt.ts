// lib/saveWritingPrompt.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type SaveWritingPromptParams = {
  level: string;
  topic: string;
  model_answer: string;
  japanese_explanation: string;
};

export async function saveWritingPrompt(params: SaveWritingPromptParams) {
  const { level, topic, model_answer, japanese_explanation } = params;
  
  // 最新の id を取得して +1
  const { data, error: selectError } = await supabase
    .from("daily_writing")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (selectError) {
    console.error("Failed to fetch latest id:", selectError);
    throw new Error("Could not determine next id");
  }

  const nextId = (data?.[0]?.id ?? 0) + 1;

  const { error } = await supabase.from("daily_writing").insert({
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
// utils/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

/**
 * サーバーサイドで使用するための Supabase クライアントを作成する
 * SERVICE_ROLE_KEY を使用するため、信頼できるサーバー環境でのみ使用すること
 */
export const supabaseServer = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

/**
 * データベース操作のためのヘルパー関数：最新のID/Numberを取得して+1する
 * @param table テーブル名
 * @param idField IDフィールド名（デフォルト: 'id'）
 * @returns 次に使用するID値
 */
export async function getNextId(
  table: string,
  idField: string = "id"
): Promise<number> {
  const { data, error } = await supabaseServer()
    .from(table)
    .select(idField)
    .order(idField, { ascending: false })
    .limit(1);

  if (error) {
    console.error(`Failed to fetch latest ${idField}:`, error);
    throw new Error(`Could not determine next ${idField}`);
  }

  if (!Array.isArray(data) || data.length == 0) {
    return 1; // データがなければ 1 番から
  }

  const row = data[0];
  const idValue = Number((row as Record<string, any>)[idField]);

  if (isNaN(idValue)) {
    throw new Error(`Invalid ID value found in table ${table}`);
  }

  return idValue + 1;
}

import { createClient } from "@supabase/supabase-js";

/**
 * サーバーサイドで使用するための Supabase クライアントを作成する
 * SERVICE_ROLE_KEY を使用するため、信頼できるサーバー環境でのみ使用
 */
export const supabaseServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Supabase環境変数が設定されていません");
  return createClient(url, key);
};

/**
 * 入力パラメータのバリデーション
 */
const validateParams = (table: string, idField: string): void => {
  if (!table?.trim()) throw new Error("テーブル名は必須です");
  if (!idField?.trim()) throw new Error("IDフィールド名は空にできません");
};

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
  validateParams(table, idField);

  interface RecordWithId {
    [key: string]: number;
  }

  try {
    const { data, error } = await supabaseServer()
      .from(table)
      .select(idField)
      .order(idField, { ascending: false })
      .limit(1);

    if (error) throw new Error(`最新の${idField}取得失敗: ${error.message}`);
    if (!Array.isArray(data) || data.length === 0) return 1;

    const row = data[0] as unknown as RecordWithId;

    if (!(idField in row)) {
      throw new Error(`IDフィールド '${idField}' がレコードに存在しません`);
    }

    const idValue = row[idField];
    if (typeof idValue !== "number" || isNaN(idValue)) {
      throw new Error(`無効なID値: ${idValue}`);
    }

    return idValue + 1;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`getNextId failed for table ${table}:`, error);
    throw error;
  }
}

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export interface SupabaseQueryOptions {
  column?: string;
  value?: unknown;
  filter?: Record<string, unknown>;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  limit?: number;
  range?: [number, number];
  select?: string;
}

export function useSupabaseData<T = unknown>(
  table: string,
  options: SupabaseQueryOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 環境変数の検証
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Supabase環境変数が設定されていません");
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        let query = supabase.from(table).select(options.select || "*");

        // クエリパラメータのデバッグログ
        console.log(`Fetching from table: ${table}`);
        console.log("Query options:", JSON.stringify({
          column: options.column,
          value: options.value,
          filter: options.filter,
          orderBy: options.orderBy,
          orderDirection: options.orderDirection,
          limit: options.limit,
          range: options.range
        }, null, 2));

        // 単一のフィルタ条件
        if (options.column && options.value !== undefined) {
          query = query.eq(options.column, options.value);
        }

        // 複数のフィルタ条件
        if (options.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        // ソート
        if (options.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.orderDirection !== "desc",
          });
        }

        // リミット
        if (options.limit) {
          query = query.limit(options.limit);
        }

        // 範囲
        if (options.range) {
          query = query.range(options.range[0], options.range[1]);
        }

        const { data: result, error: supabaseError } = await query;

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (!result || (Array.isArray(result) && result.length === 0)) {
          console.log(`No data found for table: ${table} with the provided options`);
        } else {
          console.log(`Data fetched successfully from ${table}`);
        }

        setData(result as T);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data from Supabase:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };

    fetchData();
  }, [table, JSON.stringify(options)]);

  return { data, loading, error, refetch: () => setLoading(true) };
}

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
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        );

        let query = supabase.from(table).select(options.select || "*");

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

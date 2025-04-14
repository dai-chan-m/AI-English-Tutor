import { useState, useEffect } from "react";
import { 
  fetchData, 
  type SupabaseQueryOptions, 
  type DataState 
} from "@/utils/supabaseHelpers";

/**
 * Supabaseからデータを取得するためのReact Hook
 */
export function useSupabaseData<T = unknown>(
  table: string,
  options: SupabaseQueryOptions = {}
): DataState<T> {
  const [state, setState] = useState<DataState<T>>({
    data: null,
    loading: true,
    error: null,
    refetch: () => {},
  });

  const executeQuery = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // オプションのデバッグログ
    console.log(`Fetching from table: ${table}`);
    console.log("Query options:", JSON.stringify(options, null, 2));

    try {
      const result = await fetchData<T>(table, {
        ...options,
        isServer: false
      });

      if (!result.data || (Array.isArray(result.data) && result.data.length === 0)) {
        console.log(`No data found for table: ${table} with the provided options`);
      } else {
        console.log(`Data fetched successfully from ${table}`);
      }

      setState({
        data: result.data,
        loading: false,
        error: result.error instanceof Error ? result.error : null,
        refetch: executeQuery,
      });
    } catch (error) {
      console.error("Error in useSupabaseData hook:", error);
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
        refetch: executeQuery,
      });
    }
  };

  // 依存配列に options のシリアライズされた値を含める
  useEffect(() => {
    executeQuery();
  }, [table, JSON.stringify(options)]);

  return state;
}

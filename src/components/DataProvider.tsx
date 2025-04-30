"use client";

import { useEffect, useState } from "react";
import {
  fetchData,
  type SupabaseQueryOptions,
  type DataState,
} from "@/utils/supabaseHelpers";

type DataProviderProps<T> = {
  initialData: T | null;
  initialError: string | null;
  table: string;
  options?: SupabaseQueryOptions;
  children: (state: DataState<T>) => React.ReactNode;
  refreshInterval?: number;
};

export function DataProvider<T>({
  initialData,
  initialError,
  table,
  options = {},
  children,
  refreshInterval,
}: DataProviderProps<T>) {
  const [state, setState] = useState<DataState<T>>({
    data: initialData,
    loading: false,
    error: initialError ? new Error(initialError) : null,
    refetch: () => refetchData(),
  });

  const refetchData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchData<T>(table, {
        ...options,
        isServer: false, // クライアントサイドから実行
      });

      setState({
        data: result.data,
        loading: false,
        error: result.error instanceof Error ? result.error : null,
        refetch: refetchData,
      });
    } catch (error) {
      setState({
        data: initialData, // エラー時は初期データを維持
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
        refetch: refetchData,
      });
    }
  };

  // 初回マウント時やoptions変更時に再取得
  useEffect(() => {
    // サーバーから初期データがあればすぐには取得しない
    if (!initialData) {
      refetchData();
    }
  }, [table, JSON.stringify(options)]);

  // 自動更新（指定された場合）
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(refetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval]);

  return <>{children(state)}</>;
}

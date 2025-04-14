// src/utils/supabaseHelpers.ts
import { supabaseBrowser } from './supabaseClient';
import { supabaseServer, getNextId } from './supabaseServer';
import { PostgrestError } from '@supabase/supabase-js';

export type SupabaseQueryOptions = {
  column?: string;
  value?: unknown;
  filter?: Record<string, unknown>;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  limit?: number;
  range?: [number, number];
  select?: string;
}

export type SupabaseResult<T> = {
  data: T | null;
  error: PostgrestError | Error | null;
  count?: number | null;
}

/**
 * データ取得の共通関数
 */
export async function fetchData<T>(
  table: string,
  options: SupabaseQueryOptions & { isServer?: boolean } = {}
): Promise<SupabaseResult<T>> {
  const { isServer = false, select = '*', ...queryOptions } = options;
  const client = isServer ? supabaseServer() : supabaseBrowser();

  try {
    let query = client.from(table).select(select);
    
    // 単一のフィルタ条件
    if (queryOptions.column && queryOptions.value !== undefined) {
      query = query.eq(queryOptions.column, queryOptions.value);
    }
    
    // 複数のフィルタ条件
    if (queryOptions.filter) {
      Object.entries(queryOptions.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    // ソート
    if (queryOptions.orderBy) {
      query = query.order(queryOptions.orderBy, {
        ascending: queryOptions.orderDirection !== "desc",
      });
    }
    
    // リミット
    if (queryOptions.limit) {
      query = query.limit(queryOptions.limit);
    }
    
    // 範囲
    if (queryOptions.range) {
      query = query.range(queryOptions.range[0], queryOptions.range[1]);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    return { data: data as T, error: null, count };
  } catch (error) {
    console.error(`Error fetching data from ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
}

/**
 * データ挿入の共通関数
 */
export async function insertData<T>(
  table: string, 
  data: Record<string, any>, 
  options: { isServer?: boolean; returnData?: boolean } = {}
): Promise<SupabaseResult<T>> {
  const { isServer = true, returnData = true } = options;
  const client = isServer ? supabaseServer() : supabaseBrowser();
  
  try {
    const query = client.from(table).insert(data);
    const { data: result, error } = returnData 
      ? await query.select() 
      : await query;
      
    if (error) throw error;
    return { data: result as T, error: null };
  } catch (error) {
    console.error(`Error inserting data into ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
}

/**
 * データ更新の共通関数
 */
export async function updateData<T>(
  table: string,
  data: Record<string, any>,
  conditions: Record<string, any>,
  options: { isServer?: boolean; returnData?: boolean } = {}
): Promise<SupabaseResult<T>> {
  const { isServer = true, returnData = true } = options;
  const client = isServer ? supabaseServer() : supabaseBrowser();
  
  try {
    let query = client.from(table).update(data);
    
    // 条件の適用
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data: result, error } = returnData 
      ? await query.select() 
      : await query;
    
    if (error) throw error;
    return { data: result as T, error: null };
  } catch (error) {
    console.error(`Error updating data in ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
}

/**
 * データ削除の共通関数
 */
export async function deleteData<T>(
  table: string,
  conditions: Record<string, any>,
  options: { isServer?: boolean; returnData?: boolean } = {}
): Promise<SupabaseResult<T>> {
  const { isServer = true, returnData = true } = options;
  const client = isServer ? supabaseServer() : supabaseBrowser();
  
  try {
    let query = client.from(table).delete();
    
    // 条件の適用
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data: result, error } = returnData 
      ? await query.select() 
      : await query;
    
    if (error) throw error;
    return { data: result as T, error: null };
  } catch (error) {
    console.error(`Error deleting data from ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
}

/**
 * 次のIDを取得して新しいレコードを挿入する共通関数
 */
export async function insertWithNextId<T>(
  table: string,
  data: Record<string, any>,
  idField: string = "id"
): Promise<SupabaseResult<T>> {
  try {
    const nextId = await getNextId(table, idField);
    return await insertData<T>(table, { ...data, [idField]: nextId }, { isServer: true });
  } catch (error) {
    console.error(`Error inserting with next ID into ${table}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
}

/**
 * React Hooks用の共通データロード状態管理
 */
export type DataState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * データフェッチング結果をReactの状態に変換するユーティリティ
 */
export function createDataState<T>(
  result: SupabaseResult<T>, 
  loading: boolean,
  refetch: () => void
): DataState<T> {
  return {
    data: result.data,
    loading,
    error: result.error instanceof Error ? result.error : null,
    refetch,
  };
}
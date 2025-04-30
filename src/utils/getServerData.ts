import { fetchData, type SupabaseQueryOptions } from "@/utils/supabaseHelpers";
import { cache } from "react";

export const getServerData = cache(
  async <T>(table: string, options: SupabaseQueryOptions = {}) => {
    try {
      const result = await fetchData<T>(table, {
        ...options,
        isServer: true,
      });

      if (result.error) {
        console.error(`Error fetching ${table}:`, result.error);
      }

      return {
        data: result.data,
        error:
          result.error instanceof Error
            ? result.error.message
            : result.error
            ? String(result.error)
            : null,
      };
    } catch (error) {
      console.error(`Unexpected error fetching ${table}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
);

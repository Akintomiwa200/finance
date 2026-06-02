import { api } from "@/src/lib/api";
import { fetcher } from "./fetcher.service";
import type { ApiResponse, MutationOptions } from "@/src/types/common";

export const updater = {
  async update<T, Input = Partial<T>>(
    endpoint: string,
    id: string,
    input: Input,
    options?: MutationOptions<T>
  ): Promise<ApiResponse<T>> {
    try {
      const result = await api.patch<T>(`${endpoint}/${id}`, input);

      if (result.success) {
        fetcher.invalidate(endpoint);
        fetcher.invalidate(`${endpoint}/${id}`);
        options?.onSuccess?.(result.data as T);
      } else {
        options?.onError?.(result.error ?? "Failed to update");
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      options?.onError?.(message);
      return { success: false, error: message };
    }
  },

  async bulkUpdate<T, Input = Partial<T>>(
    endpoint: string,
    ids: string[],
    input: Input,
    options?: MutationOptions<T[]>
  ): Promise<ApiResponse<T[]>> {
    try {
      const result = await api.post<T[]>(`${endpoint}/bulk-update`, { ids, ...input });

      if (result.success) {
        fetcher.invalidate(endpoint);
        options?.onSuccess?.(result.data as T[]);
      } else {
        options?.onError?.(result.error ?? "Bulk update failed");
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      options?.onError?.(message);
      return { success: false, error: message };
    }
  },
};

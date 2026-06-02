import { api } from "@/src/lib/api";
import { fetcher } from "./fetcher.service";
import { updater } from "./updater.service";
import type { ApiResponse, MutationOptions } from "@/src/types/common";

export const deleter = {
  async remove<T = void>(
    endpoint: string,
    id: string,
    options?: MutationOptions<T>
  ): Promise<ApiResponse<T>> {
    try {
      const result = await api.delete<T>(`${endpoint}/${id}`);

      if (result.success) {
        fetcher.invalidate(endpoint);
        fetcher.invalidate(`${endpoint}/${id}`);
        options?.onSuccess?.(result.data as T);
      } else {
        options?.onError?.(result.error ?? "Failed to delete");
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      options?.onError?.(message);
      return { success: false, error: message };
    }
  },

  async softRemove<T = void>(
    endpoint: string,
    id: string,
    options?: MutationOptions<T>
  ): Promise<ApiResponse<T>> {
    return updater.update<T, { isActive: boolean }>(
      endpoint,
      id,
      { isActive: false },
      options as MutationOptions<T>
    );
  },

  async bulkRemove<T = void>(
    endpoint: string,
    ids: string[],
    options?: MutationOptions<T>
  ): Promise<ApiResponse<T>> {
    try {
      const result = await api.post<T>(`${endpoint}/bulk-delete`, { ids });

      if (result.success) {
        fetcher.invalidate(endpoint);
        for (const id of ids) {
          fetcher.invalidate(`${endpoint}/${id}`);
        }
        options?.onSuccess?.(result.data as T);
      } else {
        options?.onError?.(result.error ?? "Bulk delete failed");
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      options?.onError?.(message);
      return { success: false, error: message };
    }
  },
};

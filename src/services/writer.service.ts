import { api } from "@/src/lib/api";
import { fetcher } from "./fetcher.service";
import type { ApiResponse, MutationOptions } from "@/src/types/common";

export const writer = {
  async create<T, Input = Partial<T>>(
    endpoint: string,
    input: Input,
    options?: MutationOptions<T>
  ): Promise<ApiResponse<T>> {
    try {
      const result = await api.post<T>(endpoint, input);

      if (result.success) {
        fetcher.invalidate(endpoint);
        options?.onSuccess?.(result.data as T);
      } else {
        options?.onError?.(result.error ?? "Failed to create");
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      options?.onError?.(message);
      return { success: false, error: message };
    }
  },

  async createWithFiles<T>(
    endpoint: string,
    data: Record<string, unknown>,
    files: { key: string; file: File }[],
    options?: MutationOptions<T>
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, String(value));
      }
      for (const { key, file } of files) {
        formData.append(key, file);
      }

      const result = await api.upload<T>(endpoint, formData);
      if (result.success) {
        fetcher.invalidate(endpoint);
        options?.onSuccess?.(result.data as T);
      } else {
        options?.onError?.(result.error ?? "Upload failed");
      }
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      options?.onError?.(message);
      return { success: false, error: message };
    }
  },
};

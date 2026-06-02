import { api } from "@/src/lib/api";
import type { ApiResponse, PaginationParams, PaginatedResponse } from "@/src/types/common";

export interface ServiceConfig<T, CreateInput = Partial<T>, UpdateInput = Partial<T>> {
  endpoint: string;
  revalidate?: number;
  transform?: {
    list?: (data: unknown) => T[];
    single?: (data: unknown) => T;
    create?: (input: CreateInput) => unknown;
    update?: (input: UpdateInput) => unknown;
  };
}

export function createService<T extends { id: string }, CreateInput = Partial<T>, UpdateInput = Partial<T>>(
  config: ServiceConfig<T, CreateInput, UpdateInput>
) {
  const { endpoint } = config;

  return {
    getAll(params?: PaginationParams & Record<string, unknown>): Promise<PaginatedResponse<T>> {
      return api.getPaginated<T>(endpoint, params);
    },

    getAllFlat(params?: Record<string, unknown>): Promise<ApiResponse<T[]>> {
      return api.get<T[]>(endpoint, params ? { signal: undefined } : undefined);
    },

    getById(id: string): Promise<ApiResponse<T>> {
      return api.get<T>(`${endpoint}/${id}`);
    },

    create(input: CreateInput): Promise<ApiResponse<T>> {
      const payload = config.transform?.create ? config.transform.create(input) : input;
      return api.post<T>(endpoint, payload);
    },

    update(id: string, input: UpdateInput): Promise<ApiResponse<T>> {
      const payload = config.transform?.update ? config.transform.update(input) : input;
      return api.patch<T>(`${endpoint}/${id}`, payload);
    },

    remove(id: string): Promise<ApiResponse<void>> {
      return api.delete<void>(`${endpoint}/${id}`);
    },

    getByAction(action: string, id: string): Promise<ApiResponse<T>> {
      return api.get<T>(`${endpoint}/${id}/${action}`);
    },

    postAction(action: string, id: string, body?: unknown): Promise<ApiResponse<T>> {
      return api.post<T>(`${endpoint}/${id}/${action}`, body);
    },
  };
}

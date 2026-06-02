"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetcher } from "@/src/services/fetcher.service";
import type { ApiResponse, PaginatedResponse, PaginationParams, RequestState, RequestStatus } from "@/src/types/common";

interface UseFetchOptions {
  enabled?: boolean;
  revalidate?: boolean;
  ttl?: number;
  onSuccess?: <T>(data: T) => void;
  onError?: (error: string) => void;
}

export function useFetch<T>(
  path: string | null,
  params?: Record<string, unknown>,
  options?: UseFetchOptions
) {
  const { enabled = true, revalidate, ttl, onSuccess, onError } = options ?? {};

  const [state, setState] = useState<RequestState<T>>({
    data: null,
    status: "idle",
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  const execute = useCallback(async () => {
    if (!path) return;

    setState((prev) => ({ ...prev, status: "loading", isLoading: true, error: null }));

    const result = await fetcher.get<T>(path, params, { revalidate, ttl });

    if (result.success && result.data !== undefined) {
      setState({
        data: result.data,
        status: "success",
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
      onSuccessRef.current?.(result.data);
    } else {
      setState({
        data: null,
        status: "error",
        error: result.error ?? "Unknown error",
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
      onErrorRef.current?.(result.error ?? "Unknown error");
    }
  }, [path, params, revalidate, ttl]);

  useEffect(() => {
    if (enabled && path) {
      execute();
    }
  }, [execute, enabled, path]);

  const refetch = useCallback(() => {
    fetcher.invalidate(path ?? undefined);
    return execute();
  }, [execute, path]);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data, isSuccess: true }));
  }, []);

  return { ...state, refetch, setData, execute };
}

/* ───────── Paginated variant ───────── */

export function usePaginatedFetch<T>(
  path: string | null,
  params?: PaginationParams & Record<string, unknown>,
  options?: UseFetchOptions
) {
  const { enabled = true } = options ?? {};

  const [state, setState] = useState<{
    data: T[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    status: RequestStatus;
    error: string | null;
    isLoading: boolean;
  }>({
    data: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    status: "idle",
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async () => {
    if (!path) return;
    setState((prev) => ({ ...prev, status: "loading", isLoading: true }));

    const result = await fetcher.getPaginated<T>(path, params, {
      revalidate: options?.revalidate,
      ttl: options?.ttl,
    });

    if (result.success) {
      setState({
        data: result.data ?? [],
        pagination: result.pagination,
        status: "success",
        error: null,
        isLoading: false,
      });
      options?.onSuccess?.(result.data as unknown as T);
    } else {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: result.error ?? "Unknown error",
        isLoading: false,
      }));
      options?.onError?.(result.error ?? "Unknown error");
    }
  }, [path, params, options?.revalidate, options?.ttl]);

  useEffect(() => {
    if (enabled && path) execute();
  }, [execute, enabled, path]);

  const refetch = useCallback(() => {
    fetcher.invalidate(path ?? undefined);
    return execute();
  }, [execute, path]);

  return { ...state, refetch };
}

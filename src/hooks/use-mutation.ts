"use client";

import { useState, useCallback } from "react";
import { writer } from "@/src/services/writer.service";
import { updater } from "@/src/services/updater.service";
import { deleter } from "@/src/services/deleter.service";
import type { MutationState, MutationOptions } from "@/src/types/common";

interface UseMutationConfig<T, Input = unknown> {
  mutationFn: (input: Input) => Promise<{ success: boolean; data?: T; error?: string }>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useMutation<T, Input = unknown>(config: UseMutationConfig<T, Input>) {
  const { mutationFn, onSuccess, onError } = config;

  const [state, setState] = useState<MutationState<T>>({
    data: null,
    status: "idle",
    error: null,
    isPending: false,
    isSuccess: false,
    isError: false,
  });

  const mutate = useCallback(
    async (input: Input, options?: MutationOptions<T>) => {
      setState((prev) => ({ ...prev, status: "pending" as const, isPending: true, error: null }));

      try {
        const result = await mutationFn(input);

        if (result.success && result.data !== undefined) {
          setState({
            data: result.data,
            status: "success",
            error: null,
            isPending: false,
            isSuccess: true,
            isError: false,
          });
          onSuccess?.(result.data);
          options?.onSuccess?.(result.data);
        } else {
          const errorMsg = result.error ?? "Mutation failed";
          setState({
            data: null,
            status: "error",
            error: errorMsg,
            isPending: false,
            isSuccess: false,
            isError: true,
          });
          onError?.(errorMsg);
          options?.onError?.(errorMsg);
        }

        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        setState({
          data: null,
          status: "error",
          error: message,
          isPending: false,
          isSuccess: false,
          isError: true,
        });
        onError?.(message);
        options?.onError?.(message);
        return { success: false, error: message };
      }
    },
    [mutationFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      status: "idle",
      error: null,
      isPending: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return { ...state, mutate, reset };
}

/* ───────── Factory for CRUD mutations ───────── */

export function useCreate<T, Input = Partial<T>>(
  endpoint: string,
  options?: UseMutationConfig<T, Input>
) {
  return useMutation<T, Input>({
    mutationFn: (input) => writer.create<T, Input>(endpoint, input),
    ...options,
  });
}

export function useUpdate<T, Input = Partial<T> & { id: string }>(
  endpoint: string,
  options?: UseMutationConfig<T, Input>
) {
  return useMutation<T, Input>({
    mutationFn: (input) => {
      const { id, ...rest } = input as { id: string };
      return updater.update<T, typeof rest>(endpoint, id, rest);
    },
    ...options,
  });
}

export function useDelete<T = void>(
  endpoint: string,
  options?: UseMutationConfig<T, string>
) {
  return useMutation<T, string>({
    mutationFn: (id) => deleter.remove(endpoint, id),
    ...options,
  });
}

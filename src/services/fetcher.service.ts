import { api } from "@/src/lib/api";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  CacheEntry,
  FetchOptions,
} from "@/src/types/common";

/* ───────── In-memory cache ───────── */

const cache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, Promise<ApiResponse<unknown>>>();

const DEFAULT_TTL = 30_000;

function getCacheKey(method: string, path: string, params?: unknown): string {
  return `${method}:${path}:${JSON.stringify(params ?? {})}`;
}

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < entry.ttl;
}

/* ───────── Fetcher service ───────── */

export const fetcher = {
  get<T>(
    path: string,
    params?: Record<string, unknown>,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    const query = params ? buildQuery(params) : "";
    const fullPath = query ? `${path}?${query}` : path;
    return executeWithCache<T>("GET", fullPath, undefined, options);
  },

  getPaginated<T>(
    path: string,
    params?: PaginationParams & Record<string, unknown>,
    options?: FetchOptions
  ): Promise<PaginatedResponse<T>> {
    const query = params ? buildQuery(params) : "";
    const fullPath = query ? `${path}?${query}` : path;
    return executeWithCache<PaginatedResponse<T>>("GET", fullPath, undefined, options).then(
      (res) => {
        if (res.success && res.data) {
          return res.data as PaginatedResponse<T>;
        }
        return {
          success: false,
          data: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          error: res.error,
        };
      }
    );
  },

  post<T>(path: string, body?: unknown, options?: FetchOptions): Promise<ApiResponse<T>> {
    return api.post<T>(path, body, { signal: options?.signal });
  },

  patch<T>(path: string, body?: unknown, options?: FetchOptions): Promise<ApiResponse<T>> {
    return api.patch<T>(path, body, { signal: options?.signal });
  },

  delete<T>(path: string, options?: FetchOptions): Promise<ApiResponse<T>> {
    return api.delete<T>(path, { signal: options?.signal });
  },

  invalidate(pattern?: string) {
    if (!pattern) {
      cache.clear();
      return;
    }
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  },

  getCached<T>(path: string, params?: Record<string, unknown>): T | null {
    const key = getCacheKey("GET", path, params);
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    if (entry && isCacheValid(entry)) {
      return entry.data;
    }
    return null;
  },

  prefetch<T>(path: string, params?: Record<string, unknown>, ttl?: number) {
    const query = params ? buildQuery(params) : "";
    const fullPath = query ? `${path}?${query}` : path;
    return executeWithCache<T>("GET", fullPath, undefined, { ttl }).catch(() => {});
  },
};

/* ───────── Helpers ───────── */

function buildQuery(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  return searchParams.toString();
}

async function executeWithCache<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: FetchOptions
): Promise<ApiResponse<T>> {
  const cacheKey = getCacheKey(method, path, body);
  const ttl = options?.ttl ?? DEFAULT_TTL;

  /* Check cache */
  if (!options?.revalidate) {
    const cached = cache.get(cacheKey) as CacheEntry<T> | undefined;
    if (cached && isCacheValid(cached)) {
      return { success: true, data: cached.data };
    }
  }

  /* Deduplicate concurrent requests */
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending as Promise<ApiResponse<T>>;
  }

  const promise = (async () => {
    try {
      const result = await api.request<T>(method, path, body, {
        signal: options?.signal,
      });

      if (result.success && result.data !== undefined) {
        cache.set(cacheKey, {
          data: result.data,
          timestamp: Date.now(),
          ttl,
        });
      }

      return result;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, promise);
  return promise;
}

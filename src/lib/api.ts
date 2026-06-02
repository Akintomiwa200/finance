import type { ApiResponse, PaginatedResponse, PaginationParams, RequestStatus } from "@/src/types/common";

type Interceptor = (response: Response) => Response | Promise<Response>;

class ApiClient {
  private baseUrl = "";
  private interceptors: Interceptor[] = [];
  private requestCount = 0;
  private requestStatus = new Map<string, RequestStatus>();

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  addInterceptor(fn: Interceptor) {
    this.interceptors.push(fn);
  }

  getRequestStatus(key: string): RequestStatus {
    return this.requestStatus.get(key) ?? "idle";
  }

  async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: { signal?: AbortSignal; onProgress?: (percent: number) => void }
  ): Promise<ApiResponse<T>> {
    const key = `${method}:${path}`;
    this.requestStatus.set(key, "loading");
    this.requestCount++;

    try {
      const url = `${this.baseUrl}${path}`;
      const headers: Record<string, string> = {};

      if (body && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      let response = await fetch(url, {
        method,
        headers,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      });

      for (const interceptor of this.interceptors) {
        response = await interceptor(response);
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.error ?? errorBody?.message ?? `Request failed with status ${response.status}`;
        this.requestStatus.set(key, "error");
        return { success: false, error: message };
      }

      const result = await response.json();
      this.requestStatus.set(key, "success");
      return { success: true, data: result.data ?? result };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        this.requestStatus.set(key, "idle");
        return { success: false, error: "Request cancelled" };
      }
      this.requestStatus.set(key, "error");
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    } finally {
      this.requestCount--;
    }
  }

  async get<T>(path: string, options?: { signal?: AbortSignal }): Promise<ApiResponse<T>> {
    return this.request<T>("GET", path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: { signal?: AbortSignal }): Promise<ApiResponse<T>> {
    return this.request<T>("POST", path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options?: { signal?: AbortSignal }): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: { signal?: AbortSignal }): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", path, body, options);
  }

  async delete<T>(path: string, options?: { signal?: AbortSignal }): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", path, undefined, options);
  }

  async upload<T>(path: string, formData: FormData, onProgress?: (percent: number) => void): Promise<ApiResponse<T>> {
    return this.request<T>("POST", path, formData, { onProgress });
  }

  async getPaginated<T>(
    path: string,
    params?: PaginationParams & Record<string, unknown>,
    options?: { signal?: AbortSignal }
  ): Promise<PaginatedResponse<T>> {
    const searchParams = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, String(value));
        }
      }
    }
    const query = searchParams.toString();
    const fullPath = query ? `${path}?${query}` : path;
    const result = await this.get<PaginatedResponse<T>>(fullPath, options);
    if (result.success && result.data) {
      return result.data as PaginatedResponse<T>;
    }
    return {
      success: false,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      error: result.error,
    };
  }

  isPending(): boolean {
    return this.requestCount > 0;
  }
}

export const api = new ApiClient();

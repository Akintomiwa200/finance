import type { ApiResponse, PaginatedResponse } from "@/src/types/common";

export interface ApiTransaction {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  type: string;
  category: string;
  status: string;
  date: string;
  account: string | null;
  merchant: string | null;
  reference: string | null;
  notes: string | null;
  receipt: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchTransactionsParams {
  search?: string;
  category?: string;
  status?: string;
  type?: string;
  from?: string;
  to?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

interface FetchTransactionsResponse {
  transactions: ApiTransaction[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchTransactions(params: FetchTransactionsParams = {}): Promise<FetchTransactionsResponse> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const res = await fetch(`/api/transactions?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function fetchTransaction(id: string): Promise<ApiTransaction> {
  const res = await fetch(`/api/transactions/${id}`);
  if (!res.ok) throw new Error("Failed to fetch transaction");
  const json = await res.json();
  return json.transaction;
}

export async function createTransaction(data: Partial<ApiTransaction>): Promise<ApiTransaction> {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create transaction");
  const json = await res.json();
  return json.transaction;
}

export async function updateTransaction(id: string, data: Partial<ApiTransaction>): Promise<ApiTransaction> {
  const res = await fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update transaction");
  const json = await res.json();
  return json.transaction;
}

export async function deleteTransaction(id: string): Promise<void> {
  const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete transaction");
}

// ── Generic API client for service layer ──

async function request<T>(method: string, path: string, body?: unknown, options?: { signal?: AbortSignal }): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || `Request failed with ${res.status}` };
    }
    return { success: true, data: json };
  } catch (err: any) {
    if (err.name === "AbortError") {
      return { success: false, error: "Request aborted" };
    }
    return { success: false, error: err.message };
  }
}

export const api = {
  get<T>(path: string, options?: { signal?: AbortSignal }): Promise<ApiResponse<T>> {
    return request<T>("GET", path, undefined, options);
  },
  post<T>(path: string, body?: unknown, options?: { signal?: AbortSignal }): Promise<ApiResponse<T>> {
    return request<T>("POST", path, body, options);
  },
  patch<T>(path: string, body?: unknown, options?: { signal?: AbortSignal }): Promise<ApiResponse<T>> {
    return request<T>("PATCH", path, body, options);
  },
  delete<T>(path: string, options?: { signal?: AbortSignal }): Promise<ApiResponse<T>> {
    return request<T>("DELETE", path, undefined, options);
  },
  request: request,
  getPaginated<T>(path: string, params?: Record<string, unknown>): Promise<PaginatedResponse<T>> {
    const query = params ? buildQuery(params) : "";
    const fullPath = query ? `${path}?${query}` : path;
    return request<PaginatedResponse<T>>("GET", fullPath).then((res) => {
      if (res.success && res.data) {
        return res.data as PaginatedResponse<T>;
      }
      return { success: false, data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }, error: res.error };
    });
  },
  upload<T>(path: string, formData: FormData): Promise<ApiResponse<T>> {
    return fetch(path, { method: "POST", body: formData }).then(async (res) => {
      const json = await res.json();
      if (!res.ok) return { success: false, error: json.error || "Upload failed" };
      return { success: true, data: json as T };
    });
  },
};

function buildQuery(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  return searchParams.toString();
}

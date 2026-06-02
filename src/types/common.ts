/* ───────── Generic API Response ───────── */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/* ───────── API Request State ───────── */

export type RequestStatus = "idle" | "loading" | "pending" | "success" | "error";

export interface RequestState<T = unknown> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/* ───────── Mutation State ───────── */

export interface MutationState<T = unknown> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/* ───────── Cache Entry ───────── */

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
}

/* ───────── Options ───────── */

export interface FetchOptions {
  revalidate?: boolean;
  ttl?: number;
  signal?: AbortSignal;
  onProgress?: (percent: number) => void;
}

export interface MutationOptions<T = unknown> {
  optimisticData?: T;
  rollbackOnError?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

/* ───────── Common Domain Types ───────── */

export interface SelectOption {
  label: string;
  value: string;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface SummaryMetric {
  label: string;
  value: number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  format?: "currency" | "percentage" | "number";
}

/* ───────── Filter / Sort ───────── */

export interface FilterOption {
  field: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "in" | "between";
  value: unknown;
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

/* ───────── Real-time ───────── */

export type RealtimeEvent = "create" | "update" | "delete" | "approve" | "reject" | "payment" | "notification";

export interface RealtimeMessage<T = unknown> {
  event: RealtimeEvent;
  entity: string;
  data: T;
  timestamp: string;
  userId?: string;
}

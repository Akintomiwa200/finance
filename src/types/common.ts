export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

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

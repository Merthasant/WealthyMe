interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown | null;
  meta: Meta | null;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

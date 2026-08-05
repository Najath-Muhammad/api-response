export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface SuccessResponseOptions<T = unknown> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  details?: unknown;
}

export interface ErrorResponseOptions {
  message: string;
  statusCode?: number;
  details?: unknown;
}

export interface PaginationInput {
  page: number;

  limit: number;

  totalItems: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type ApiErrorDetails = Record<string, unknown>;

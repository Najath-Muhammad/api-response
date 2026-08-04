/**
 * response.types.ts — Central type definitions for the entire package.
 *
 * WHY THIS FILE EXISTS:
 * All TypeScript interfaces live here in one place. Every other file imports
 * from here. If you ever need to change a response shape, you change it once
 * and the change propagates everywhere automatically.
 */

// ---------------------------------------------------------------------------
// Success Response
// ---------------------------------------------------------------------------

/**
 * Shape of every successful API response.
 *
 * @example
 * { "success": true, "message": "User fetched", "data": { ... } }
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

/**
 * Input options for successResponse().
 * message is optional — defaults to "Success" in the function.
 */
export interface SuccessResponseOptions<T = unknown> {
  data: T;
  message?: string;
}

// ---------------------------------------------------------------------------
// Error Response
// ---------------------------------------------------------------------------

/**
 * Shape of every error API response.
 *
 * @example
 * { "success": false, "message": "Not found", "statusCode": 404 }
 */
export interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  details?: unknown;
}

/**
 * Input options for errorResponse().
 * statusCode defaults to 500 if not provided.
 */
export interface ErrorResponseOptions {
  message: string;
  statusCode?: number;
  details?: unknown;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

/** Input for createPagination(). */
export interface PaginationInput {
  /** Current page number (1-indexed). Values < 1 are clamped to 1. */
  page: number;
  /** Number of items per page. Values < 1 are clamped to 1. */
  limit: number;
  /** Total items across all pages. */
  totalItems: number;
}

/** Output from createPagination(). */
export interface PaginationResult {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------

/** Optional structured details attached to an ApiError. */
export type ApiErrorDetails = Record<string, unknown>;

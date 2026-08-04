/**
 * index.ts — Public API Entry Point
 *
 * WHY THIS EXISTS:
 * This is the single export surface of the package. Every function, class,
 * and type that a consumer can import is listed here.
 *
 * Consumers always write:
 *   import { ApiError, asyncHandler } from "@najathm/api-response";
 *
 * They never import from internal paths like:
 *   import { ApiError } from "@najathm/api-response/src/errors/ApiError.js"
 *
 * This gives us the freedom to move files around internally without breaking
 * anyone's code — as long as we keep this file's exports stable.
 */

// Utilities
export { successResponse } from "./utils/successResponse.js";
export { errorResponse } from "./utils/errorResponse.js";
export { createPagination } from "./utils/pagination.js";

// Custom Error
export { ApiError } from "./errors/ApiError.js";

// Express Middleware
export { apiResponse } from "./middleware/apiResponse.js";
export { apiErrorHandler } from "./middleware/apiErrorHandler.js";

// Async Handler
export { asyncHandler } from "./asyncHandler.js";

// TypeScript Types — consumers can use these for their own annotations
export type {
  SuccessResponse,
  SuccessResponseOptions,
  ErrorResponse,
  ErrorResponseOptions,
  PaginationInput,
  PaginationResult,
  ApiErrorDetails,
} from "./types/response.types.js";

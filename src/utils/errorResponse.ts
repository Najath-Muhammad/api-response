/**
 * errorResponse.ts
 *
 * WHY THIS EXISTS:
 * Error responses must be consistent across every route — always `success: false`,
 * always a `statusCode`, always a `message`. Without centralising this, different
 * handlers end up sending slightly different shapes which breaks API consumers.
 *
 * Pure function — no side effects, easy to test.
 */

import type { ErrorResponse, ErrorResponseOptions } from "../types/response.types.js";

/**
 * Build a standardized error response object.
 *
 * @param options - message (required), statusCode (default: 500), details (optional)
 * @returns ErrorResponse shaped object ready to be sent as JSON
 *
 * @example
 * errorResponse({ message: "Not found", statusCode: 404 })
 * // { success: false, message: "Not found", statusCode: 404 }
 *
 * errorResponse({ message: "Server error" })
 * // { success: false, message: "Server error", statusCode: 500 }
 */
export function errorResponse(options: ErrorResponseOptions): ErrorResponse {
  const result: ErrorResponse = {
    success: false,
    message: options.message,
    statusCode: options.statusCode ?? 500,
  };

  if (options.details !== undefined) {
    result.details = options.details;
  }

  return result;
}

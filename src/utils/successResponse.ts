/**
 * successResponse.ts
 *
 * WHY THIS EXISTS:
 * Every route handler needs to send a JSON response. Without this utility,
 * each handler would manually build { success: true, message: ..., data: ... }
 * and they'd all look slightly different. This ensures a consistent shape.
 *
 * This is a PURE FUNCTION: given the same input, it always returns the same output.
 * No side effects. Easy to test.
 */

import type { SuccessResponse, SuccessResponseOptions } from "../types/response.types.js";

/**
 * Build a standardized success response object.
 *
 * @param options - Object with `data` (required) and optional `message`
 * @returns SuccessResponse shaped object ready to be sent as JSON
 *
 * @example
 * successResponse({ data: user, message: "User fetched" })
 * // { success: true, message: "User fetched", data: { ... } }
 *
 * successResponse({ data: users })
 * // { success: true, message: "Success", data: [...] }
 */
export function successResponse<T = unknown>(options: SuccessResponseOptions<T>): SuccessResponse<T> {
  return {
    success: true,
    message: options.message ?? "Success",
    data: options.data,
  };
}

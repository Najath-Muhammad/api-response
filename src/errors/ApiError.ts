/**
 * ApiError.ts
 *
 * WHY THIS EXISTS:
 * JavaScript's built-in Error class only carries `message` and `stack`.
 * In a REST API we need the HTTP status code and optional validation details.
 *
 * By extending Error:
 *   - Stack traces are preserved (debug-friendly)
 *   - `instanceof ApiError` checks work in error middleware
 *   - It integrates naturally with Express: err.statusCode is readable
 *
 * WHY Object.setPrototypeOf:
 * When TypeScript compiles `class extends Error` to older targets, the prototype
 * chain can break — `err instanceof ApiError` returns false even though it should
 * be true. setPrototypeOf restores it explicitly. This is a well-known TypeScript
 * gotcha documented at: https://bit.ly/ts-extending-built-ins
 */

import type { ApiErrorDetails } from "../types/response.types.js";

/**
 * Custom API error with HTTP status code and optional details.
 *
 * @example
 * throw new ApiError("User not found", 404);
 * throw new ApiError("Validation failed", 400, { field: "email" });
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details: ApiErrorDetails | undefined;
  /** Lets middleware distinguish ApiError from unknown errors without instanceof */
  public readonly isApiError: true = true;

  constructor(message: string, statusCode: number = 500, details?: ApiErrorDetails) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    // Restore prototype chain broken by TypeScript's extends-built-in compilation
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

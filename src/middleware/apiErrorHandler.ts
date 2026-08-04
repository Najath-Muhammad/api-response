/**
 * apiErrorHandler.ts — Express Error-Handling Middleware
 *
 * WHY THIS EXISTS:
 * Express error handlers have a special 4-parameter signature: (err, req, res, next).
 * Express detects this and routes any error passed to next(error) to this function.
 *
 * This middleware:
 *   1. Checks if error is an ApiError → uses its statusCode and message
 *   2. Unknown errors → returns generic 500, never exposing internals
 *
 * SECURITY: Never expose stack traces or internal messages in production.
 * An attacker could learn your database schema, file paths, or dependencies.
 *
 * REGISTER LAST — after all routes:
 *   app.use(apiResponse());      // first
 *   app.get("/...", handler);    // routes
 *   app.use(apiErrorHandler());  // LAST
 */

import type { ErrorRequestHandler } from "express";
import { ApiError } from "../errors/ApiError.js";
import { errorResponse } from "../utils/errorResponse.js";

/**
 * Express error-handling middleware. Formats ApiError and unknown errors
 * into standardized JSON responses without leaking internal details.
 *
 * @example
 * app.use(apiErrorHandler()); // Register last in your Express app
 */
export function apiErrorHandler(): ErrorRequestHandler {
  // _next is required by Express to identify this as error middleware (4 params).
  // Removing it breaks error detection. Underscore prefix silences TS warning.
  return function apiErrorHandlerMiddleware(err, _req, res, _next): void {
    // Case 1: Known ApiError — use its specific statusCode and message
    if (err instanceof ApiError || (err as ApiError).isApiError === true) {
      const apiErr = err as ApiError;
      if (apiErr.details !== undefined) {
        res.status(apiErr.statusCode).json(
          errorResponse({ message: apiErr.message, statusCode: apiErr.statusCode, details: apiErr.details }),
        );
      } else {
        res.status(apiErr.statusCode).json(
          errorResponse({ message: apiErr.message, statusCode: apiErr.statusCode }),
        );
      }
      return;
    }

    // Case 2: Unknown error — log server-side (dev only), hide from client
    if (process.env["NODE_ENV"] !== "production") {
      console.error("[ApiErrorHandler] Unhandled error:", err);
    }

    res.status(500).json(errorResponse({ message: "Internal Server Error", statusCode: 500 }));
  };
}

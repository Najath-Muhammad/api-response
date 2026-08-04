/**
 * apiResponse.ts — Express Response Augmentation Middleware
 *
 * WHY THIS EXISTS:
 * This middleware attaches res.success() and res.error() to every Express
 * response object so route handlers can write concise, consistent responses:
 *
 *   res.success(user, "User fetched");   ← sends 200 JSON
 *   res.error("Not found", 404);         ← sends 404 JSON
 *
 * HOW TYPESCRIPT KNOWS ABOUT res.success / res.error:
 * "Declaration Merging" — we augment the Express.Response interface inside
 * a `declare global` block. TypeScript merges our additions into the existing
 * type, so editors autocomplete `res.success()` without any extra imports.
 *
 * HOW THE MIDDLEWARE WORKS:
 * Express middleware = (req, res, next) => void
 * Our middleware runs on every request, attaches the two helpers, then calls
 * next() to pass control to the next handler.
 */

import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/errorResponse.js";
import { successResponse } from "../utils/successResponse.js";

// ---------------------------------------------------------------------------
// TypeScript Declaration Merging — teaches TS about our new res methods
// ---------------------------------------------------------------------------
declare global {
  namespace Express {
    interface Response {
      /**
       * Send a standardized success response.
       * @param data    - Response payload
       * @param message - Human-readable message (default: "Success")
       * @param status  - HTTP status code (default: 200)
       */
      success: (data: unknown, message?: string, status?: number) => void;

      /**
       * Send a standardized error response.
       * @param message    - Error description
       * @param statusCode - HTTP status code (default: 500)
       * @param details    - Optional validation details
       */
      error: (message: string, statusCode?: number, details?: unknown) => void;
    }
  }
}

// ---------------------------------------------------------------------------
// Middleware Factory
// ---------------------------------------------------------------------------

/**
 * Express middleware that adds res.success() and res.error() to every response.
 * Register BEFORE all routes.
 *
 * @example
 * app.use(apiResponse());
 *
 * app.get("/users/:id", (req, res) => {
 *   res.success({ id: 1 }, "User fetched");
 * });
 */
export function apiResponse() {
  return function (_req: Request, res: Response, next: NextFunction): void {
    // Attach res.success()
    // Note: we handle the optional message carefully for exactOptionalPropertyTypes
    res.success = function (data: unknown, message?: string, status: number = 200): void {
      if (message !== undefined) {
        res.status(status).json(successResponse({ data, message }));
      } else {
        res.status(status).json(successResponse({ data }));
      }
    };

    // Attach res.error()
    res.error = function (message: string, statusCode: number = 500, details?: unknown): void {
      if (details !== undefined) {
        res.status(statusCode).json(errorResponse({ message, statusCode, details }));
      } else {
        res.status(statusCode).json(errorResponse({ message, statusCode }));
      }
    };

    next();
  };
}

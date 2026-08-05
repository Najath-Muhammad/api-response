import type { ErrorRequestHandler } from "express";
import { ApiError } from "../errors/ApiError.js";
import { errorResponse } from "../utils/errorResponse.js";

export function apiErrorHandler(): ErrorRequestHandler {
  return function apiErrorHandlerMiddleware(err, _req, res, _next): void {
    if (err instanceof ApiError || (err as ApiError).isApiError === true) {
      const apiErr = err as ApiError;
      if (apiErr.details !== undefined) {
        res
          .status(apiErr.statusCode)
          .json(
            errorResponse({
              message: apiErr.message,
              statusCode: apiErr.statusCode,
              details: apiErr.details,
            }),
          );
      } else {
        res
          .status(apiErr.statusCode)
          .json(errorResponse({ message: apiErr.message, statusCode: apiErr.statusCode }));
      }
      return;
    }

    if (process.env["NODE_ENV"] !== "production") {
      console.error("[ApiErrorHandler] Unhandled error:", err);
    }

    res.status(500).json(errorResponse({ message: "Internal Server Error", statusCode: 500 }));
  };
}

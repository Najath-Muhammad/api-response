import type { ErrorResponse, ErrorResponseOptions } from "../types/response.types.js";

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

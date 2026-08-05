import type { ApiErrorDetails } from "../types/response.types.js";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details: ApiErrorDetails | undefined;

  public readonly isApiError: true = true;

  constructor(message: string, statusCode: number = 500, details?: ApiErrorDetails) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

import type { SuccessResponse, SuccessResponseOptions } from "../types/response.types.js";

export function successResponse<T = unknown>(
  options: SuccessResponseOptions<T>,
): SuccessResponse<T> {
  return {
    success: true,
    message: options.message ?? "Success",
    data: options.data,
  };
}

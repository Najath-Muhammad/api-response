import type { PaginationInput, PaginationResult } from "../types/response.types.js";

export function createPagination(input: PaginationInput): PaginationResult {
  const limit = Math.max(1, Math.floor(input.limit));
  const totalItems = Math.max(0, Math.floor(input.totalItems));
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
  const page = Math.max(1, Math.floor(input.page));

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

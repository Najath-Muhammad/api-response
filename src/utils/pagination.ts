/**
 * pagination.ts
 *
 * WHY THIS EXISTS:
 * Every paginated API endpoint has to calculate the same things:
 *   - How many total pages? → Math.ceil(totalItems / limit)
 *   - Is there a next page? → page < totalPages
 *   - Is there a prev page? → page > 1
 *
 * Getting this wrong (division by zero, off-by-one errors) is common.
 * Centralising it here means it's tested once and correct everywhere.
 *
 * EDGE CASE DECISIONS:
 *   page < 1     → clamped to 1 (silent recovery)
 *   limit < 1    → clamped to 1 (prevents ÷0)
 *   totalItems=0 → totalPages=0, no next/prev
 *   page > total → hasNextPage=false, page returned as-is
 *   non-integers → floored (2.9 → 2)
 */

import type { PaginationInput, PaginationResult } from "../types/response.types.js";

/**
 * Calculate pagination metadata.
 *
 * @example
 * createPagination({ page: 2, limit: 10, totalItems: 57 })
 * // { page: 2, limit: 10, totalItems: 57, totalPages: 6, hasNextPage: true, hasPreviousPage: true }
 */
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

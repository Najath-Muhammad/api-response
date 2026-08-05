import { describe, expect, it } from "vitest";
import { createPagination } from "../src/utils/pagination.js";

describe("createPagination()", () => {
  it("calculates a normal middle page correctly", () => {
    const result = createPagination({ page: 2, limit: 10, totalItems: 57 });
    expect(result).toEqual({
      page: 2,
      limit: 10,
      totalItems: 57,
      totalPages: 6,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it("calculates the first page correctly", () => {
    const result = createPagination({ page: 1, limit: 10, totalItems: 57 });
    expect(result.page).toBe(1);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });

  it("calculates the last page correctly", () => {
    const result = createPagination({ page: 6, limit: 10, totalItems: 57 });
    expect(result.page).toBe(6);
    expect(result.totalPages).toBe(6);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
  });

  it("calculates totalPages when items divide evenly", () => {
    expect(createPagination({ page: 1, limit: 10, totalItems: 50 }).totalPages).toBe(5);
  });

  it("rounds up totalPages when items do not divide evenly", () => {
    expect(createPagination({ page: 1, limit: 10, totalItems: 51 }).totalPages).toBe(6);
  });

  it("handles single item", () => {
    const result = createPagination({ page: 1, limit: 10, totalItems: 1 });
    expect(result.totalPages).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });

  it("handles zero total items", () => {
    const result = createPagination({ page: 1, limit: 10, totalItems: 0 });
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });

  it("clamps page 0 to 1", () => {
    expect(createPagination({ page: 0, limit: 10, totalItems: 50 }).page).toBe(1);
  });

  it("clamps negative page to 1", () => {
    expect(createPagination({ page: -5, limit: 10, totalItems: 50 }).page).toBe(1);
  });

  it("clamps limit 0 to 1", () => {
    const result = createPagination({ page: 1, limit: 0, totalItems: 10 });
    expect(result.limit).toBe(1);
    expect(result.totalPages).toBe(10);
  });

  it("clamps negative limit to 1", () => {
    expect(createPagination({ page: 1, limit: -5, totalItems: 10 }).limit).toBe(1);
  });

  it("clamps negative totalItems to 0", () => {
    const result = createPagination({ page: 1, limit: 10, totalItems: -100 });
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it("floors non-integer page", () => {
    expect(createPagination({ page: 2.7, limit: 10, totalItems: 50 }).page).toBe(2);
  });

  it("floors non-integer limit", () => {
    expect(createPagination({ page: 1, limit: 10.9, totalItems: 50 }).limit).toBe(10);
  });

  it("page beyond totalPages has no next page", () => {
    const result = createPagination({ page: 100, limit: 10, totalItems: 50 });
    expect(result.page).toBe(100);
    expect(result.totalPages).toBe(5);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
  });
});

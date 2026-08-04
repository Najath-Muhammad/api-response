import { describe, expect, it } from "vitest";
import { errorResponse } from "../src/utils/errorResponse.js";

describe("errorResponse()", () => {
  it("returns success: false always", () => {
    expect(errorResponse({ message: "Error" }).success).toBe(false);
  });

  it("includes the provided message", () => {
    const result = errorResponse({ message: "User not found" });
    expect(result.message).toBe("User not found");
  });

  it("defaults statusCode to 500 when not provided", () => {
    const result = errorResponse({ message: "Unexpected error" });
    expect(result.statusCode).toBe(500);
  });

  it("uses 404 statusCode", () => {
    const result = errorResponse({ message: "Not found", statusCode: 404 });
    expect(result.statusCode).toBe(404);
  });

  it("uses 400 statusCode", () => {
    const result = errorResponse({ message: "Bad input", statusCode: 400 });
    expect(result.statusCode).toBe(400);
  });

  it("uses 401 statusCode", () => {
    const result = errorResponse({ message: "Unauthorized", statusCode: 401 });
    expect(result.statusCode).toBe(401);
  });

  it("does not include details when not provided", () => {
    const result = errorResponse({ message: "Error" });
    expect(result.details).toBeUndefined();
  });

  it("includes details when provided", () => {
    const details = { field: "email", issue: "required" };
    const result = errorResponse({ message: "Validation failed", statusCode: 400, details });
    expect(result.details).toEqual(details);
  });

  it("has correct full shape without details", () => {
    const result = errorResponse({ message: "Not found", statusCode: 404 });
    expect(result).toEqual({ success: false, message: "Not found", statusCode: 404 });
  });

  it("has correct full shape with details", () => {
    const result = errorResponse({
      message: "Validation failed",
      statusCode: 400,
      details: { field: "email" },
    });
    expect(result).toEqual({
      success: false,
      message: "Validation failed",
      statusCode: 400,
      details: { field: "email" },
    });
  });
});

import { describe, expect, it } from "vitest";
import { ApiError } from "../src/errors/ApiError.js";

describe("ApiError", () => {
  it("is an instance of native Error", () => {
    expect(new ApiError("test", 500)).toBeInstanceOf(Error);
  });

  it("is an instance of ApiError", () => {
    expect(new ApiError("test", 500)).toBeInstanceOf(ApiError);
  });

  it("has correct message", () => {
    expect(new ApiError("User not found", 404).message).toBe("User not found");
  });

  it("has correct statusCode", () => {
    expect(new ApiError("Not found", 404).statusCode).toBe(404);
  });

  it("defaults statusCode to 500", () => {
    expect(new ApiError("Error").statusCode).toBe(500);
  });

  it("has name set to ApiError", () => {
    expect(new ApiError("test", 400).name).toBe("ApiError");
  });

  it("has isApiError flag set to true", () => {
    expect(new ApiError("test", 400).isApiError).toBe(true);
  });

  it("has a stack trace", () => {
    expect(new ApiError("test", 500).stack).toBeDefined();
  });

  it("details is undefined when not provided", () => {
    expect(new ApiError("test", 400).details).toBeUndefined();
  });

  it("includes details when provided", () => {
    const details = { field: "email", issue: "invalid" };
    const err = new ApiError("Validation failed", 400, details);
    expect(err.details).toEqual(details);
  });

  it("works with common HTTP status codes", () => {
    [400, 401, 403, 404, 422, 500, 503].forEach((code) => {
      expect(new ApiError("Error", code).statusCode).toBe(code);
    });
  });

  it("instanceof works correctly after throw/catch", () => {
    let isApiError = false;
    try {
      throw new ApiError("Test", 400);
    } catch (err) {
      isApiError = err instanceof ApiError;
    }
    expect(isApiError).toBe(true);
  });
});

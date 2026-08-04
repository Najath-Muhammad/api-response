import { describe, expect, it } from "vitest";
import { successResponse } from "../src/utils/successResponse.js";

describe("successResponse()", () => {
  it("returns success: true always", () => {
    expect(successResponse({ data: {} }).success).toBe(true);
  });

  it("uses provided message", () => {
    const result = successResponse({ data: {}, message: "User fetched" });
    expect(result.message).toBe("User fetched");
  });

  it("defaults message to 'Success' when not provided", () => {
    const result = successResponse({ data: {} });
    expect(result.message).toBe("Success");
  });

  it("includes the data field", () => {
    const user = { id: 1, name: "Najath" };
    const result = successResponse({ data: user });
    expect(result.data).toEqual(user);
  });

  it("accepts null as data", () => {
    const result = successResponse({ data: null });
    expect(result.data).toBeNull();
  });

  it("accepts an array as data", () => {
    const users = [{ id: 1 }, { id: 2 }];
    const result = successResponse({ data: users });
    expect(result.data).toEqual(users);
  });

  it("accepts a string as data", () => {
    const result = successResponse({ data: "hello" });
    expect(result.data).toBe("hello");
  });

  it("accepts a number as data", () => {
    const result = successResponse({ data: 42 });
    expect(result.data).toBe(42);
  });

  it("has the correct full shape", () => {
    const result = successResponse({ data: { id: 1 }, message: "OK" });
    expect(result).toEqual({ success: true, message: "OK", data: { id: 1 } });
  });
});

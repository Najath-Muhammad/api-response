import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../src/middleware/apiResponse.js";
import { apiErrorHandler } from "../src/middleware/apiErrorHandler.js";
import { ApiError } from "../src/errors/ApiError.js";

import { asyncHandler } from "../src/asyncHandler.js";

const mockReq = {} as Request;
const mockRes = {} as Response;

describe("asyncHandler()", () => {
  it("calls the wrapped async function", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const handler = asyncHandler(fn);
    const next = vi.fn() as unknown as NextFunction;

    handler(mockReq, mockRes, next);
    await new Promise((r) => setImmediate(r));

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(mockReq, mockRes, next);
  });

  it("does not call next() on success", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const handler = asyncHandler(fn);
    const next = vi.fn() as unknown as NextFunction;

    handler(mockReq, mockRes, next);
    await new Promise((r) => setImmediate(r));

    expect(next).not.toHaveBeenCalled();
  });

  it("calls next(error) when async function throws", async () => {
    const error = new Error("DB down");
    const fn = vi.fn().mockRejectedValue(error);
    const handler = asyncHandler(fn);
    const next = vi.fn() as unknown as NextFunction;

    handler(mockReq, mockRes, next);
    await new Promise((r) => setImmediate(r));

    expect(next).toHaveBeenCalledWith(error);
  });

  it("forwards ApiError through next()", async () => {
    const apiError = new ApiError("Not found", 404);
    const fn = vi.fn().mockRejectedValue(apiError);
    const handler = asyncHandler(fn);
    const next = vi.fn() as unknown as NextFunction;

    handler(mockReq, mockRes, next);
    await new Promise((r) => setImmediate(r));

    const forwarded = (next as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as ApiError;
    expect(forwarded).toBeInstanceOf(ApiError);
    expect(forwarded.statusCode).toBe(404);
  });

  it("forwards string errors through next()", async () => {
    const fn = vi.fn().mockRejectedValue("string error");
    const handler = asyncHandler(fn);
    const next = vi.fn() as unknown as NextFunction;

    handler(mockReq, mockRes, next);
    await new Promise((r) => setImmediate(r));

    expect(next).toHaveBeenCalledWith("string error");
  });
});

function createMockRes(): Response & { _statusCode: number; _body: unknown } {
  const res = {
    _statusCode: 200,
    _body: null as unknown,
    status(code: number) {
      this._statusCode = code;
      return this;
    },
    json(body: unknown) {
      this._body = body;
      return this;
    },
    success: undefined as unknown,
    error: undefined as unknown,
  } as unknown as Response & { _statusCode: number; _body: unknown };
  return res;
}

describe("apiResponse() middleware", () => {
  let res: ReturnType<typeof createMockRes>;
  let next: NextFunction;

  beforeEach(() => {
    res = createMockRes();
    next = vi.fn() as unknown as NextFunction;
  });

  it("calls next() to pass control forward", () => {
    apiResponse()(mockReq, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("attaches res.success() method", () => {
    apiResponse()(mockReq, res, next);
    expect(typeof (res as unknown as Record<string, unknown>)["success"]).toBe("function");
  });

  it("attaches res.error() method", () => {
    apiResponse()(mockReq, res, next);
    expect(typeof (res as unknown as Record<string, unknown>)["error"]).toBe("function");
  });

  it("res.success() sends correct shape with message", () => {
    apiResponse()(mockReq, res, next);
    (res as unknown as { success: (d: unknown, m: string) => void }).success({ id: 1 }, "Fetched");
    expect(res._statusCode).toBe(200);
    expect(res._body).toEqual({ success: true, message: "Fetched", data: { id: 1 } });
  });

  it("res.success() uses default message when none provided", () => {
    apiResponse()(mockReq, res, next);
    (res as unknown as { success: (d: unknown) => void }).success({ id: 1 });
    expect((res._body as { message: string }).message).toBe("Success");
  });

  it("res.success() accepts custom status code", () => {
    apiResponse()(mockReq, res, next);
    (res as unknown as { success: (d: unknown, m: string, s: number) => void }).success(
      {},
      "Created",
      201,
    );
    expect(res._statusCode).toBe(201);
  });

  it("res.error() sends correct shape", () => {
    apiResponse()(mockReq, res, next);
    (res as unknown as { error: (m: string, s: number) => void }).error("Not found", 404);
    expect(res._statusCode).toBe(404);
    expect(res._body).toEqual({ success: false, message: "Not found", statusCode: 404 });
  });

  it("res.error() defaults statusCode to 500", () => {
    apiResponse()(mockReq, res, next);
    (res as unknown as { error: (m: string) => void }).error("Internal error");
    expect(res._statusCode).toBe(500);
  });

  it("res.error() includes details when provided", () => {
    apiResponse()(mockReq, res, next);
    (res as unknown as { error: (m: string, s: number, d: unknown) => void }).error(
      "Validation failed",
      400,
      { field: "email" },
    );
    expect((res._body as { details: unknown }).details).toEqual({ field: "email" });
  });
});

describe("apiErrorHandler() middleware", () => {
  let res: ReturnType<typeof createMockRes>;
  let next: NextFunction;

  beforeEach(() => {
    res = createMockRes();
    next = vi.fn() as unknown as NextFunction;
  });

  it("handles ApiError with correct statusCode and message", () => {
    apiErrorHandler()(new ApiError("Not found", 404), mockReq, res, next);
    expect(res._statusCode).toBe(404);
    expect(res._body).toEqual({ success: false, message: "Not found", statusCode: 404 });
  });

  it("handles ApiError with details", () => {
    apiErrorHandler()(
      new ApiError("Validation failed", 400, { field: "email" }),
      mockReq,
      res,
      next,
    );
    expect(res._statusCode).toBe(400);
    expect((res._body as { details: unknown }).details).toEqual({ field: "email" });
  });

  it("returns 500 for unknown errors", () => {
    apiErrorHandler()(new Error("Unknown crash"), mockReq, res, next);
    expect(res._statusCode).toBe(500);
    expect(res._body).toEqual({
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    });
  });

  it("does not expose internal message for unknown errors", () => {
    apiErrorHandler()(new Error("SELECT * FROM users"), mockReq, res, next);
    expect((res._body as { message: string }).message).toBe("Internal Server Error");
  });

  it("handles string errors as unknown (500)", () => {
    apiErrorHandler()("just a string error", mockReq, res, next);
    expect(res._statusCode).toBe(500);
  });

  it("handles ApiError with 401 status code", () => {
    apiErrorHandler()(new ApiError("Unauthorized", 401), mockReq, res, next);
    expect(res._statusCode).toBe(401);
  });
});

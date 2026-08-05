import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/errorResponse.js";
import { successResponse } from "../utils/successResponse.js";

declare global {
  namespace Express {
    interface Response {
      success: (data: unknown, message?: string, status?: number) => void;

      error: (message: string, statusCode?: number, details?: unknown) => void;
    }
  }
}

export function apiResponse() {
  return function (_req: Request, res: Response, next: NextFunction): void {
    res.success = function (data: unknown, message?: string, status: number = 200): void {
      if (message !== undefined) {
        res.status(status).json(successResponse({ data, message }));
      } else {
        res.status(status).json(successResponse({ data }));
      }
    };

    res.error = function (message: string, statusCode: number = 500, details?: unknown): void {
      if (details !== undefined) {
        res.status(statusCode).json(errorResponse({ message, statusCode, details }));
      } else {
        res.status(statusCode).json(errorResponse({ message, statusCode }));
      }
    };

    next();
  };
}

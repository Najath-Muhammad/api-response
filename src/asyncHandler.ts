/**
 * asyncHandler.ts
 *
 * WHY THIS EXISTS:
 * Express 4 does NOT catch errors from async functions automatically.
 *
 * Problem without asyncHandler:
 *   app.get("/users", async (req, res) => {
 *     throw new Error("crash"); // Express never sees this — request hangs!
 *   });
 *
 * Solution — asyncHandler wraps async functions and calls next(error):
 *   app.get("/users", asyncHandler(async (req, res) => {
 *     throw new Error("crash"); // Caught, forwarded to apiErrorHandler()
 *   }));
 *
 * HOW IT WORKS — Higher-Order Function pattern:
 *   1. You pass your async handler to asyncHandler()
 *   2. asyncHandler returns a normal (sync) function Express can call
 *   3. Inside, it runs your async handler with .catch(next)
 *   4. Any rejection is automatically forwarded to error middleware
 */

import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wrap an async Express route handler to forward errors to next().
 *
 * @param fn - Async Express request handler
 * @returns Synchronous wrapper that Express can register as a route handler
 *
 * @example
 * app.get("/users", asyncHandler(async (req, res) => {
 *   const users = await getUsers(); // safe — errors go to error middleware
 *   res.success(users, "Users fetched");
 * }));
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}

# @najathm/api-response

> A lightweight, TypeScript-first library that standardizes API responses, error handling, pagination metadata, and async route handling for Express.js applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

---

## Features

- ✅ **TypeScript-first** — Strict types, `.d.ts` declarations included, no separate `@types` needed
- ✅ **Standard success responses** — Consistent `{ success, message, data }` shape
- ✅ **Standard error responses** — Consistent `{ success, message, statusCode }` shape
- ✅ **Express middleware** — `res.success()` and `res.error()` on every response object
- ✅ **Custom ApiError class** — Extends native `Error` with `statusCode` and `details`
- ✅ **Error middleware** — Catches all errors without leaking internals to production
- ✅ **Pagination utility** — Computes `totalPages`, `hasNextPage`, `hasPreviousPage` with edge case handling
- ✅ **Async handler** — Prevents async route handlers from silently hanging Express
- ✅ **ESM + CommonJS** — Works with `import` and `require()`
- ✅ **Zero runtime dependencies**

---

## Installation

```bash
npm install @najathm/api-response
```

Express is a peer dependency:

```bash
npm install express
npm install -D @types/express
```

---

## Quick Start

```ts
import express from "express";
import {
  apiResponse,
  apiErrorHandler,
  asyncHandler,
  ApiError,
  createPagination,
} from "@najathm/api-response";

const app = express();
app.use(express.json());

// 1. Register response helpers before all routes
app.use(apiResponse());

// 2. Use asyncHandler for async routes — errors go to apiErrorHandler automatically
app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await getUserFromDB(req.params.id);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    res.success(user, "User fetched successfully");
  }),
);

// 3. Paginated list example
app.get(
  "/users",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { users, total } = await getUsers({ page, limit });

    const pagination = createPagination({ page, limit, totalItems: total });
    res.success({ users, pagination }, "Users fetched successfully");
  }),
);

// 4. Error handler LAST — catches all ApiError and unknown errors
app.use(apiErrorHandler());

app.listen(3000);
```

---

## API Documentation

### `successResponse(options)`

Pure function. Builds a standardized success response object.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | `T` | ✅ | Response payload (any type) |
| `message` | `string` | ❌ | Message (default: `"Success"`) |

**Returns:** `{ success: true, message: string, data: T }`

```ts
successResponse({ data: user, message: "User fetched" })
// { success: true, message: "User fetched", data: { ... } }
```

---

### `errorResponse(options)`

Pure function. Builds a standardized error response object.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | `string` | ✅ | Error description |
| `statusCode` | `number` | ❌ | HTTP status code (default: `500`) |
| `details` | `unknown` | ❌ | Structured validation details |

**Returns:** `{ success: false, message: string, statusCode: number, details?: unknown }`

```ts
errorResponse({ message: "Not found", statusCode: 404 })
// { success: false, message: "Not found", statusCode: 404 }
```

---

### `apiResponse()` — Middleware

Attaches `res.success()` and `res.error()` to every Express response. Register **before** all routes.

```ts
app.use(apiResponse());
```

#### `res.success(data, message?, status?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | `unknown` | — | Response payload |
| `message` | `string` | `"Success"` | Message |
| `status` | `number` | `200` | HTTP status code |

```ts
res.success(user, "User fetched");          // 200
res.success(newUser, "User created", 201);   // 201
```

#### `res.error(message, statusCode?, details?)`

```ts
res.error("Not found", 404);
res.error("Validation failed", 400, { field: "email" });
```

---

### `ApiError`

Custom error class. Extend with `statusCode` and optional `details`.

```ts
throw new ApiError("User not found", 404);
throw new ApiError("Validation failed", 400, { field: "email", issue: "required" });
```

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Error message |
| `statusCode` | `number` | HTTP status code (default: `500`) |
| `details` | `ApiErrorDetails \| undefined` | Optional validation info |
| `isApiError` | `true` | Flag for middleware detection |
| `name` | `"ApiError"` | Class name in stack traces |

---

### `apiErrorHandler()` — Error Middleware

Catches all errors forwarded via `next(error)` or thrown inside `asyncHandler`. Register **last**.

```ts
app.use(apiErrorHandler());
```

- `ApiError` → uses its `statusCode` and `message`
- Unknown errors → returns `500 Internal Server Error` (never leaks internals)

---

### `asyncHandler(fn)`

Wraps async route handlers so thrown errors reach `apiErrorHandler()`.

```ts
app.get("/users", asyncHandler(async (req, res) => {
  const users = await getUsers(); // errors safely forwarded to next()
  res.success(users, "Users fetched");
}));
```

---

### `createPagination(input)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Current page (clamped to ≥1) |
| `limit` | `number` | Items per page (clamped to ≥1) |
| `totalItems` | `number` | Total items across all pages |

```ts
createPagination({ page: 2, limit: 10, totalItems: 57 })
// { page: 2, limit: 10, totalItems: 57, totalPages: 6, hasNextPage: true, hasPreviousPage: true }
```

**Edge cases:** `page < 1` → clamped to 1 | `limit < 1` → clamped to 1 | `totalItems = 0` → `totalPages = 0`

---

## TypeScript Types

All types are exported:

```ts
import type {
  SuccessResponse,
  SuccessResponseOptions,
  ErrorResponse,
  ErrorResponseOptions,
  PaginationInput,
  PaginationResult,
  ApiErrorDetails,
} from "@najathm/api-response";
```

---

## Development

```bash
# Install dependencies
npm install

# Build (ESM + CJS + .d.ts)
npm run build

# Run all tests
npm test

# Watch mode
npm run test:watch

# TypeScript type checking
npm run typecheck

# Linting
npm run lint

# Auto-format
npm run format
```

---

## Git Development Workflow

This project uses feature branches for development:

```
main                 ← stable, release-ready
│
├── feat/response-utils
├── feat/api-error
├── feat/express-middleware
├── feat/pagination
├── feat/async-handler
├── test/package-tests
├── docs/readme
└── chore/npm-build
```

**To create a feature branch:**
```bash
git checkout -b feat/my-feature
# ... implement ...
git add .
git commit -m "feat: add my feature"
git push -u origin feat/my-feature
# Then open a Pull Request on GitHub
```

---

## NPM Publishing

Do NOT publish automatically. When ready:

```bash
npm run build
npm test
npm run lint
npm run typecheck
npm pack --dry-run   # Preview what will be packaged

# Then publish:
npm login
npm whoami
npm publish --access public   # --access public is required for @scoped packages
```

---

## Using in a MERN Project

```bash
npm install @najathm/api-response
```

In your Express backend:

```ts
import express from "express";
import { apiResponse, apiErrorHandler, asyncHandler, ApiError } from "@najathm/api-response";

const app = express();
app.use(express.json());
app.use(apiResponse());

// Your routes...

app.use(apiErrorHandler());
```

---

## License

[MIT](./LICENSE) © Najath Muhammad

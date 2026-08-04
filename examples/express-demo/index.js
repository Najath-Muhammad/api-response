/**
 * index.js — Express Demo Application
 *
 * Demonstrates how a developer uses @najathm/api-response in a real Express app.
 *
 * HOW TO RUN (two options):
 *
 * Option 1 — Use the local build (recommended during development):
 *   1. From project root: npm run build
 *   2. cd examples/express-demo && npm install
 *   3. node index.js
 *
 * Option 2 — After publishing to npm:
 *   1. npm install @najathm/api-response
 *   2. Change the import path below from "../../dist/index.js" to "@najathm/api-response"
 *   3. node index.js
 *
 * TEST ENDPOINTS:
 *   curl http://localhost:3000/health
 *   curl http://localhost:3000/users
 *   curl http://localhost:3000/users/1
 *   curl http://localhost:3000/users/999         (triggers 404 ApiError)
 *   curl "http://localhost:3000/users?page=1&limit=2"
 *   curl -X POST http://localhost:3000/users \
 *     -H "Content-Type: application/json" \
 *     -d '{"name":"Alice","email":"alice@example.com"}'
 */

import express from "express";

// For local dev, import from the built dist folder.
// After publishing: import { ... } from "@najathm/api-response"
import {
  apiResponse,
  apiErrorHandler,
  asyncHandler,
  ApiError,
  createPagination,
} from "../../dist/index.js";

const app = express();
app.use(express.json());

// Register response helpers BEFORE routes
app.use(apiResponse());

// In-memory "database" for this demo
const users = [
  { id: "1", name: "Najath Muhammad", email: "najath@example.com", role: "admin" },
  { id: "2", name: "Alice Johnson", email: "alice@example.com", role: "user" },
  { id: "3", name: "Bob Smith", email: "bob@example.com", role: "user" },
];

// Health check
app.get("/health", (_req, res) => {
  res.success({ status: "ok", timestamp: new Date().toISOString() }, "Service is healthy");
});

// Get all users with pagination
app.get(
  "/users",
  asyncHandler(async (req, res) => {
    const page = parseInt(String(req.query["page"] ?? "1"), 10);
    const limit = parseInt(String(req.query["limit"] ?? "10"), 10);

    const pagination = createPagination({ page, limit, totalItems: users.length });
    const start = (page - 1) * limit;
    const paginatedUsers = users.slice(start, start + limit);

    res.success({ users: paginatedUsers, pagination }, "Users fetched successfully");
  }),
);

// Get a single user by ID
app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    // Simulate async DB lookup
    await new Promise((resolve) => setTimeout(resolve, 10));

    const user = users.find((u) => u.id === req.params["id"]);

    if (!user) {
      throw new ApiError(`User with id '${req.params["id"]}' not found`, 404);
    }

    res.success(user, "User fetched successfully");
  }),
);

// Create a new user
app.post(
  "/users",
  asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ApiError("Validation failed", 400, {
        missing: [!name && "name", !email && "email"].filter(Boolean),
      });
    }

    const newUser = { id: String(users.length + 1), name, email, role: "user" };
    users.push(newUser);

    res.success(newUser, "User created successfully", 201);
  }),
);

// Error handler LAST
app.use(apiErrorHandler());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Express Demo: http://localhost:${PORT}`);
  console.log("  GET  /health");
  console.log("  GET  /users");
  console.log("  GET  /users/1");
  console.log("  GET  /users/999  (404 ApiError)");
  console.log("  POST /users      { name, email }\n");
});

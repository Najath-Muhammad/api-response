import express from "express";

import {
  apiResponse,
  apiErrorHandler,
  asyncHandler,
  ApiError,
  createPagination,
} from "../../dist/index.js";

const app = express();
app.use(express.json());

app.use(apiResponse());

const users = [
  { id: "1", name: "Najath Muhammad", email: "najath@example.com", role: "admin" },
  { id: "2", name: "Alice Johnson", email: "alice@example.com", role: "user" },
  { id: "3", name: "Bob Smith", email: "bob@example.com", role: "user" },
];

app.get("/health", (_req, res) => {
  res.success({ status: "ok", timestamp: new Date().toISOString() }, "Service is healthy");
});

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

app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 10));

    const user = users.find((u) => u.id === req.params["id"]);

    if (!user) {
      throw new ApiError(`User with id '${req.params["id"]}' not found`, 404);
    }

    res.success(user, "User fetched successfully");
  }),
);

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

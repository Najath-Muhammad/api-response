# Why We Use `@najathm/api-response`

If you've ever built an Express.js API, you know that Express is incredibly unopinionated. It doesn't tell you *how* to format your responses, and it doesn't automatically catch errors in `async` functions. 

Because of this, teams usually end up with:
1. **Inconsistent responses:** One developer sends `{ message: "ok", user }`, another sends `{ success: true, data: user }`.
2. **Try/Catch hell:** Every single route is wrapped in a massive `try/catch` block.
3. **Silent crashes:** If someone forgets a `try/catch` on an async route, the server just hangs and the user is left waiting forever.

`@najathm/api-response` is a lightweight, TypeScript-first package that solves all of this by giving you a standardized, reliable way to handle API responses.

Here is how it simplifies our code:

---

## 1. Sending Success Responses

**❌ The Old Way (Messy & Inconsistent)**
Every developer formats the JSON differently, and you have to manually set status codes and structure the object.

```typescript
app.get("/users/:id", async (req, res) => {
  const user = await db.getUser(req.params.id);
  
  // Developer 1's style
  res.status(200).json({ 
    success: true, 
    msg: "User found", 
    results: user 
  });
});
```

**✅ The New Way (Clean & Standardized)**
We inject a `res.success()` method directly into Express. It automatically formats the response into a strict `{ success, message, data }` shape.

```typescript
app.get("/users/:id", async (req, res) => {
  const user = await db.getUser(req.params.id);
  
  // Clean, simple, and gives full TypeScript autocomplete!
  res.success(user, "User found"); 
});
```

---

## 2. Handling Async Errors

**❌ The Old Way (Try/Catch Hell)**
Express 4 does not catch async errors. If you don't use `try/catch` and call `next(error)`, the request hangs forever.

```typescript
app.get("/users", async (req, res, next) => {
  try {
    const users = await db.getUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    // You have to write this boilerplate in EVERY single route
    next(error); 
  }
});
```

**✅ The New Way (The `asyncHandler`)**
Just wrap your route in `asyncHandler()`. You never have to write a `try/catch` block again. If a promise rejects, it is automatically caught and forwarded to the global error handler.

```typescript
app.get("/users", asyncHandler(async (req, res) => {
  const users = await db.getUsers(); // If this throws an error, it is safely caught!
  res.success(users);
}));
```

---

## 3. Throwing API Errors

**❌ The Old Way (Generic Errors)**
Standard JavaScript `Error` objects don't have HTTP status codes.

```typescript
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.getUser(req.params.id);
    if (!user) {
      // You have to manually set the status on the response, then return
      return res.status(404).json({ error: "User not found" });
    }
  } catch(e) {
    next(e);
  }
});
```

**✅ The New Way (The `ApiError` class)**
Just `throw new ApiError()`. You pass it a message and a status code. The global error handler catches it and formats it perfectly for the frontend.

```typescript
app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await db.getUser(req.params.id);
  
  if (!user) {
    // Instantly stops execution, sends a 404 to the client cleanly
    throw new ApiError("User not found", 404);
  }
  
  res.success(user);
}));
```

---

## 4. Pagination Made Easy

**❌ The Old Way (Manual Math)**
Calculating `totalPages` and figuring out if there is a `hasNextPage` requires manual math in every route, which often leads to bugs when `totalItems` is 0.

**✅ The New Way (The `createPagination` utility)**
You just pass in the page, limit, and total items. The package handles all the math and edge cases instantly.

```typescript
const pagination = createPagination({ page: 2, limit: 10, totalItems: 57 });

/* Returns:
{
  page: 2,
  limit: 10,
  totalItems: 57,
  totalPages: 6,
  hasNextPage: true,
  hasPreviousPage: true
}
*/
```

---

## Summary of Benefits for the Team

* **Zero Boilerplate:** No more copying and pasting response objects.
* **100% Type-Safe:** Built purely in TypeScript, so your editor will autocomplete `res.success()` and warn you if you format something wrong.
* **Predictable Frontend:** Frontend developers will always know exactly what the API response will look like, making UI integration a breeze.

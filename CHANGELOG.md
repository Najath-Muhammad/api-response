# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned

- Optional timestamp field in responses
- Request ID tracking support

---

## [1.0.0] - 2026-08-04

### Added

- `successResponse()` — standardized success response builder
- `errorResponse()` — standardized error response builder
- `createPagination()` — pagination metadata calculator with full edge case handling
- `ApiError` — custom error class extending native `Error` with `statusCode` and `details`
- `apiResponse()` — Express middleware adding `res.success()` and `res.error()`
- `apiErrorHandler()` — Express error middleware handling `ApiError` and unknown errors
- `asyncHandler()` — higher-order function for async route error forwarding
- Full TypeScript types exported for consumer use
- ESM and CommonJS dual output via tsup
- 56 unit tests via Vitest (all passing)
- Strict TypeScript configuration
- ESLint 9 flat config with TypeScript rules
- Prettier code formatting
- Complete README with API documentation
- LEARNING.md — educational guide for Node.js developers
- MIT License

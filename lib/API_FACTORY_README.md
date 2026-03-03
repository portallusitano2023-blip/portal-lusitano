# API Route Factory Documentation

A production-ready factory function for standardizing API routes with built-in validation, authentication, rate limiting, error handling, and monitoring.

## Quick Start

### Basic Usage

```typescript
// lib/api-handlers/users.ts
import { createApiRoute } from "@/lib/createApiRoute";
import { userSchema } from "@/lib/schemas";

export const GET = createApiRoute(
  async (req, { auth, params }) => {
    const user = await db.user.findUnique({
      where: { id: params.id as string },
    });
    return user;
  },
  { auth: "user" }
);

export const POST = createApiRoute(
  async (req, { auth, params }) => {
    const body = await req.json();
    const user = await db.user.create({ data: body });
    return user;
  },
  { auth: "admin", schema: userSchema }
);
```

## Features

### 1. **Type-Safe Handlers**

Handlers are fully typed with TypeScript inference:

```typescript
const handler: ApiHandler<{ id: string; name: string }> = async (req, context) => {
  // Return type is automatically inferred and validated
  return { id: "123", name: "John" };
};
```

### 2. **Zod Schema Validation**

Automatically validate request bodies:

```typescript
export const POST = createApiRoute(
  async (req, context) => {
    // Body is automatically parsed and validated
    // Zod errors are caught and returned as 400 Bad Request
    return { success: true };
  },
  { schema: userSchema }
);
```

### 3. **Role-Based Authentication**

Three authentication levels:

```typescript
// No auth required (public)
export const GET = createApiRoute(async (req, { auth }) => {
  console.log(auth.isAuthenticated); // false
  return { data: "public" };
});

// User auth required
export const POST = createApiRoute(
  async (req, { auth }) => {
    console.log(auth.email); // "user@example.com"
    return { data: "user-only" };
  },
  { auth: "user" }
);

// Admin auth required
export const DELETE = createApiRoute(
  async (req, { auth }) => {
    console.log(auth.isAdmin); // true
    return { data: "admin-only" };
  },
  { auth: "admin" }
);
```

### 4. **Rate Limiting**

Per-IP rate limiting (Upstash Redis backend):

```typescript
export const POST = createApiRoute(
  async (req, context) => {
    return { success: true };
  },
  {
    rateLimit: {
      requests: 100,
      window: 60 * 1000, // 1 minute
    },
  }
);
```

### 5. **Standardized Responses**

All responses follow a consistent format:

```typescript
// Success (2xx)
{
  "ok": true,
  "data": { ... },
  "timestamp": 1234567890
}

// Error (4xx/5xx)
{
  "ok": false,
  "error": "User not found",
  "code": "NOT_FOUND",
  "details": { ... },
  "timestamp": 1234567890
}
```

### 6. **Error Handling**

Standardized error responses with proper HTTP status codes:

```typescript
// Automatically returns 401 Unauthorized
{
  auth: "user";
}

// Automatically returns 400 Bad Request
{
  schema: userSchema;
}

// Throw custom errors
throw {
  status: 404,
  message: "User not found",
  code: "NOT_FOUND",
};
```

### 7. **Request Logging**

Automatic timing and logging:

```
[API] GET /api/users/123 - 200 OK (45ms)
[API] POST /api/users - 400 Validation error (12ms)
[API] DELETE /api/users/456 - 401 Unauthorized (8ms)
```

### 8. **Sentry Integration**

Errors are automatically captured in Sentry with context:

```typescript
// Includes: path, method, status, duration, IP
Sentry.captureException(error, {
  tags: { handler: "api-route-factory", ... },
  contexts: { api: { ip, duration, statusCode } },
});
```

## Configuration Options

```typescript
interface ApiRouteOptions {
  // Zod schema for request body validation
  schema?: ZodSchema;

  // Auth level: 'none' (default) | 'user' | 'admin'
  auth?: AuthLevel;

  // Rate limiting per IP
  rateLimit?: {
    requests: number;
    window: number; // milliseconds
  };

  // ISR cache configuration (future)
  cache?: {
    revalidate: number | false; // seconds
  };
}
```

## Context Object

Passed to every handler:

```typescript
interface ApiContext {
  auth: {
    isAuthenticated: boolean;
    email?: string;
    isAdmin?: boolean;
  };
  params: Record<string, string | string[]>;
  query: Record<string, string | string[]>;
  ip?: string;
}
```

## Response Helpers

Manually building responses (when handler returns NextResponse):

```typescript
import { apiResponse } from "@/lib/createApiRoute";

// Success response
const response = apiResponse.ok({ data: "success" });

// Error response
const error = apiResponse.error("Something went wrong", {
  code: "ERROR_CODE",
  details: { field: "error message" },
});
```

## Middleware Functions

Individual middleware available for custom use:

```typescript
import {
  extractClientIp,
  verifyAuth,
  validateRequestBody,
  checkRateLimit,
} from "@/lib/api-factory-middleware";

// Extract client IP
const ip = await extractClientIp(req);

// Verify authentication
const auth = await verifyAuth("user");

// Validate body
const data = await validateRequestBody(userSchema, req);

// Check rate limit
await checkRateLimit(ip, { requests: 100, window: 60000 });
```

## Error Codes

Standard error codes returned in API responses:

| Code                  | Status | Description                   |
| --------------------- | ------ | ----------------------------- |
| `INTERNAL_ERROR`      | 500    | Unhandled server error        |
| `VALIDATION_ERROR`    | 400    | Request validation failed     |
| `AUTH_REQUIRED`       | 401    | User authentication required  |
| `ADMIN_REQUIRED`      | 401    | Admin authentication required |
| `RATE_LIMIT_EXCEEDED` | 429    | Too many requests             |

## Migration Guide

Converting existing endpoints to use the factory:

### Before

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    // Auth check
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Business logic
    const user = await db.user.create({ data: validation.data });

    // Response
    return NextResponse.json({ data: user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### After

```typescript
export const POST = createApiRoute(
  async (req, { auth }) => {
    const user = await db.user.create({ data: body });
    return user;
  },
  { auth: "user", schema: userSchema }
);
```

## Type Safety

All types are exported for use in custom code:

```typescript
import type {
  ApiRouteOptions,
  ApiContext,
  ApiHandler,
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiResponse,
} from "@/lib/createApiRoute";
```

## Files

- `lib/createApiRoute.ts` - Main factory function
- `lib/api-factory-response.ts` - Response helpers
- `lib/api-factory-middleware.ts` - Individual middleware
- `lib/api-factory-types.ts` - TypeScript type definitions

## Performance

- **Lightweight**: Minimal overhead (~1-2ms per request)
- **Non-blocking**: Rate limiting check is async and non-blocking
- **Streaming**: Handlers can return NextResponse for streaming responses
- **Caching**: Response format is deterministic for HTTP caching

## Examples

### List with Pagination

```typescript
export const GET = createApiRoute(
  async (req, { params }) => {
    const page = parseInt(params.page as string) || 1;
    const limit = parseInt(params.limit as string) || 20;

    const items = await db.items.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, page, limit };
  },
  { auth: "user" }
);
```

### Create with Validation

```typescript
export const POST = createApiRoute(
  async (req, { auth }) => {
    const item = await db.items.create({
      data: body,
      select: { id: true, name: true },
    });

    return item;
  },
  { auth: "user", schema: itemSchema }
);
```

### Update with Auth Check

```typescript
export const PUT = createApiRoute(
  async (req, { auth, params }) => {
    const item = await db.items.findUnique({
      where: { id: params.id as string },
    });

    if (!item || item.userId !== auth.email) {
      throw { status: 403, message: "Forbidden", code: "FORBIDDEN" };
    }

    const updated = await db.items.update({
      where: { id: params.id as string },
      data: body,
    });

    return updated;
  },
  { auth: "user", schema: itemUpdateSchema }
);
```

### Delete with Rate Limiting

```typescript
export const DELETE = createApiRoute(
  async (req, { auth, params }) => {
    await db.items.delete({ where: { id: params.id as string } });
    return { deleted: true };
  },
  {
    auth: "admin",
    rateLimit: { requests: 50, window: 60000 },
  }
);
```

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { logger } from "./logger";
import { apiResponse } from "./api-factory-response";
import {
  extractClientIp,
  verifyAuth,
  validateRequestBody,
  checkRateLimit,
} from "./api-factory-middleware";
import type {
  ApiRouteOptions,
  ApiContext,
  ApiHandler,
  ApiFactoryError,
  isApiFactoryError,
} from "./api-factory-types";

// Re-export types and helpers for convenience
export type {
  ApiRouteOptions,
  ApiContext,
  ApiHandler,
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiResponse,
} from "./api-factory-types";
export { apiResponse } from "./api-factory-response";

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Factory function to create standardized API route handlers
 * Wraps handler with validation, auth, rate limiting, error handling, and Sentry capture
 *
 * Features:
 * - Type-safe request/response handling
 * - Zod schema validation
 * - Role-based authentication (none/user/admin)
 * - Rate limiting (via Upstash Redis)
 * - Standardized error responses
 * - Automatic Sentry error capture
 * - Request logging and timing
 *
 * @template T Handler return type
 * @param handler API handler function
 * @param options Configuration options
 * @returns Next.js API route handler (req => Promise<NextResponse>)
 *
 * @example
 * ```typescript
 * // Simple public route
 * export const GET = createApiRoute(
 *   async (req, { params }) => {
 *     return { message: "Hello" };
 *   }
 * );
 *
 * // Authenticated with validation
 * export const POST = createApiRoute(
 *   async (req, { auth, params }) => {
 *     if (!auth.isAuthenticated) return null;
 *     const data = await db.get(params.id);
 *     return data;
 *   },
 *   { auth: "user", schema: userSchema }
 * );
 *
 * // Admin-only with rate limiting
 * export const DELETE = createApiRoute(
 *   async (req, { auth, params }) => {
 *     await db.delete(params.id);
 *     return { deleted: true };
 *   },
 *   {
 *     auth: "admin",
 *     rateLimit: { requests: 10, window: 60000 }
 *   }
 * );
 * ```
 */
export function createApiRoute<T = unknown>(
  handler: ApiHandler<T>,
  options: ApiRouteOptions = {}
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const url = new URL(req.url);
    const routePath = url.pathname;
    const method = req.method;

    let clientIp = "0.0.0.0";
    let status = 500;
    let message = "Internal server error";

    try {
      // Extract client IP early for logging and rate limiting
      clientIp = await extractClientIp(req);

      // 1. Rate limiting check
      if (options.rateLimit) {
        await checkRateLimit(clientIp, options.rateLimit);
      }

      // 2. Authentication verification
      const authLevel = options.auth || "none";
      const auth = await verifyAuth(authLevel);

      // 3. Request body/query validation
      let validatedData: unknown = null;
      if (options.schema) {
        validatedData = await validateRequestBody(options.schema, req);
      }

      // 4. Build context for handler
      const params = Object.fromEntries(url.searchParams.entries());
      const context: ApiContext = {
        auth,
        params,
        query: params,
        ip: clientIp,
      };

      // 5. Execute the handler
      const result = await handler(req, context);

      // 6. If handler returned NextResponse directly, send it as-is
      if (result instanceof NextResponse) {
        logger.debug(`[API] ${method} ${routePath} - Direct response sent`);
        return result;
      }

      // 7. Wrap result in standard response format
      const duration = Date.now() - startTime;
      const response = apiResponse.ok(result, { timestamp: true });

      logger.debug(`[API] ${method} ${routePath} - 200 OK (${duration}ms)`);

      return NextResponse.json(response, { status: 200 });
    } catch (error: unknown) {
      const duration = Date.now() - startTime;
      let code = "INTERNAL_ERROR";
      let details: Record<string, unknown> | undefined;

      // Parse error to extract HTTP status and message
      if (error && typeof error === "object" && "status" in error) {
        const apiError = error as {
          status: number;
          message: string;
          code?: string;
          details?: unknown;
        };
        status = apiError.status;
        message = apiError.message;
        code = apiError.code || code;
        details = apiError.details as Record<string, unknown> | undefined;

        logger.debug(`[API] ${method} ${routePath} - ${status} ${message} (${duration}ms)`);
      } else if (error instanceof Error) {
        logger.error(`[API] ${method} ${routePath} - ${error.message}`, error);
        status = 500;
        message = error.message;
      } else {
        logger.error(`[API] ${method} ${routePath} - Unknown error`, error);
        status = 500;
        message = "Internal server error";
      }

      // Capture error in Sentry (avoid logging PII)
      Sentry.captureException(error, {
        tags: {
          handler: "api-route-factory",
          path: routePath,
          method,
          status,
        },
        contexts: {
          api: {
            ip: clientIp,
            duration,
            statusCode: status,
          },
        },
        level: status >= 500 ? "error" : "warning",
      });

      // Build error response
      const errorResponse = apiResponse.error(message, {
        code,
        details,
        timestamp: true,
      });

      return NextResponse.json(errorResponse, { status });
    }
  };
}

import { NextRequest } from "next/server";
import { ZodSchema } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { verifySession } from "./auth";
import { logger } from "./logger";
import { apiResponse, ApiErrorResponse } from "./api-factory-response";

// ---------------------------------------------------------------------------
// Upstash Redis client — shared across all rate-limit checks in this process.
// We only instantiate if the env vars are present so the app still boots in
// environments without Redis configured (dev / CI).
// ---------------------------------------------------------------------------
let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    _redis = new Redis({ url, token });
  }
  return _redis;
}

// Cache Ratelimit instances keyed by "<requests>:<windowSeconds>" so we don't
// recreate them on every request (important for serverless warm instances).
const _limiterCache = new Map<string, Ratelimit>();

function getLimiter(config: RateLimitConfig): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  // Convert window from ms → nearest whole seconds (min 1 s)
  const windowSeconds = Math.max(1, Math.round(config.window / 1000));
  const cacheKey = `${config.requests}:${windowSeconds}`;

  if (_limiterCache.has(cacheKey)) {
    return _limiterCache.get(cacheKey)!;
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, `${windowSeconds} s`),
    prefix: "@portal-lusitano/rl",
    // Disable ephemeralCache — serverless functions are short-lived so the
    // in-process map would only cache within a single cold-start which is fine,
    // but it can mask bugs when testing.  Keep it simple.
    ephemeralCache: false,
  });

  _limiterCache.set(cacheKey, limiter);
  return limiter;
}

/**
 * API Middleware functions
 * Individual middleware that can be composed or used with the factory
 */

/**
 * Extract client IP from request headers
 * Respects X-Forwarded-For (proxy), X-Real-IP, and direct socket
 */
export async function extractClientIp(req: NextRequest): Promise<string> {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Fallback - this won't work in Next.js server routes but shows intent
  return "0.0.0.0";
}

/**
 * Auth context after verification
 */
export interface AuthContext {
  isAuthenticated: boolean;
  email?: string;
  isAdmin?: boolean;
}

/**
 * Verify authentication level
 * Throws with proper error object on auth failure
 *
 * @param level 'none' | 'user' | 'admin'
 * @returns Auth context object
 *
 * @throws Object with { status, message, code } on auth failure
 */
export async function verifyAuth(level: "none" | "user" | "admin"): Promise<AuthContext> {
  if (level === "none") {
    return { isAuthenticated: false };
  }

  const email = await verifySession();

  if (level === "admin" && !email) {
    throw {
      status: 401,
      message: "Unauthorized: Admin access required",
      code: "ADMIN_REQUIRED",
    };
  }

  if (level === "user" && !email) {
    throw {
      status: 401,
      message: "Unauthorized: User session required",
      code: "AUTH_REQUIRED",
    };
  }

  return {
    isAuthenticated: !!email,
    email: email || undefined,
    isAdmin: !!email,
  };
}

/**
 * Validate request body against Zod schema
 * Supports JSON and form-encoded content types
 *
 * @param schema Zod schema for validation
 * @param req NextRequest to validate
 * @returns Parsed and validated body
 *
 * @throws Object with { status, message, code, details } on validation failure
 */
export async function validateRequestBody(schema: ZodSchema, req: NextRequest): Promise<unknown> {
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: unknown = null;

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData);
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData);
    }

    return schema.parse(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown validation error";

    throw {
      status: 400,
      message: "Validation error",
      code: "VALIDATION_ERROR",
      details: { validation: message },
    };
  }
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  requests: number;
  window: number; // milliseconds
}

/**
 * Rate limit checker using Upstash Redis
 * Returns early if limit exceeded, throws on Redis error
 *
 * @param ip Client IP address
 * @param config Rate limit configuration
 * @throws Object with { status, message, code } on rate limit exceeded
 *
 * @example
 * ```typescript
 * await checkRateLimit(ip, { requests: 100, window: 60000 });
 * ```
 */
export async function checkRateLimit(ip: string, config: RateLimitConfig): Promise<void> {
  const limiter = getLimiter(config);

  if (!limiter) {
    // Redis not configured — log once so operators notice in non-prod envs,
    // but don't block traffic (fail-open is safer than bricking the API).
    logger.warn("[RateLimit] UPSTASH_REDIS_REST_URL / TOKEN not set — rate limiting disabled");
    return;
  }

  let result: Awaited<ReturnType<typeof limiter.limit>>;
  try {
    result = await limiter.limit(ip);
  } catch (err) {
    // Redis unreachable — fail-open: log the error but allow the request.
    // A flapping Redis should not take down the API.
    logger.error("[RateLimit] Redis error, allowing request through:", err);
    return;
  }

  logger.debug(
    `[RateLimit] ip=${ip} limit=${result.limit} remaining=${result.remaining} success=${result.success}`
  );

  if (!result.success) {
    throw {
      status: 429,
      message: "Too many requests. Please slow down.",
      code: "RATE_LIMIT_EXCEEDED",
      details: {
        limit: result.limit,
        remaining: 0,
        reset: new Date(result.reset).toISOString(),
      },
    };
  }
}

/**
 * Compose multiple validation steps into single check
 * Short-circuits on first error
 *
 * @example
 * ```typescript
 * const validators = [
 *   validateRequestBody(schema, req),
 *   checkRateLimit(ip, rateLimitConfig),
 * ];
 * await Promise.all(validators);
 * ```
 */
export async function withValidation(schema: ZodSchema, req: NextRequest): Promise<unknown> {
  return validateRequestBody(schema, req);
}

export async function withAuth(level: "none" | "user" | "admin"): Promise<AuthContext> {
  return verifyAuth(level);
}

export async function withRateLimit(ip: string, config: RateLimitConfig): Promise<void> {
  return checkRateLimit(ip, config);
}

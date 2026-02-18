/**
 * Upstash Redis rate limiters — serverless-safe sliding window
 * HIGH-01 fix: replaces in-memory Map (ineffective in serverless/multi-instance)
 *
 * Free tier: 500k commands/month, resets monthly
 * @upstash/ratelimit docs: https://github.com/upstash/ratelimit
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Auth routes: 10 requests per 15 minutes per IP
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  analytics: true,
  prefix: "rl:auth",
});

// General API routes: 60 requests per minute per IP
export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
  prefix: "rl:api",
});

export { redis };

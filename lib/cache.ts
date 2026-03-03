import { unstable_cache } from "next/cache";

// Simple in-memory cache with TTL
class Cache {
  private cache: Map<string, { value: unknown; expiry: number }>;

  constructor() {
    this.cache = new Map();
  }

  set(key: string, value: unknown, ttl: number = 3600000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * In-memory cache instance.
 *
 * ⚠️  SERVERLESS NOTE: This is a best-effort, per-instance cache.
 * In Vercel Functions each cold start creates a new instance — cache
 * entries are lost on cold starts (typically every few minutes of inactivity).
 * For persistent caching across instances use `createServerCache` below.
 *
 * @deprecated Prefer `createServerCache` for new code. This export is kept
 *             for backward compatibility only.
 */
export const memCache = new Cache();

// Run cleanup every 5 minutes (only on persistent Node.js processes; no-op in serverless)
if (typeof window === "undefined") {
  setInterval(
    () => {
      memCache.cleanup();
    },
    5 * 60 * 1000
  );
}

// Cache decorator for functions
/** @deprecated Prefer `createServerCache` for new code. */
export function memoize<T extends (...args: never[]) => unknown>(fn: T, ttl: number = 3600000): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = `memoize:${fn.name}:${JSON.stringify(args)}`;
    const cached = memCache.get<ReturnType<T>>(key);

    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    memCache.set(key, result, ttl);
    return result as ReturnType<T>;
  }) as T;
}

// Async cache decorator
/** @deprecated Prefer `createServerCache` for new code. */
export function memoizeAsync<T extends (...args: never[]) => Promise<unknown>>(
  fn: T,
  ttl: number = 3600000
): T {
  return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = `memoize:${fn.name}:${JSON.stringify(args)}`;
    const cached = memCache.get<Awaited<ReturnType<T>>>(key);

    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    memCache.set(key, result, ttl);
    return result as Awaited<ReturnType<T>>;
  }) as T;
}

// ─────────────────────────────────────────────────────────────────────────────
// NEXT.JS PERSISTENT CACHE  (replaces memCache for new server-side code)

export interface ServerCacheOptions {
  /**
   * Unique key segments — uniquely identify this cached value across all
   * server instances. Include all inputs that affect the result.
   * @example ['coudelarias']  or  ['cavalo', horseId]
   */
  key: string[];
  /**
   * Time-to-live in seconds (default: 3600 = 1 hour).
   * Pass `false` to cache indefinitely until a manual `revalidateTag()` call.
   */
  revalidate?: number | false;
  /**
   * Cache tags for on-demand purge via `revalidateTag()`.
   * @example tags: ['coudelarias'] → call revalidateTag('coudelarias') in a webhook
   */
  tags?: string[];
}

/**
 * Wraps an async function with Next.js `unstable_cache` for persistent,
 * cross-instance caching that survives serverless cold starts.
 *
 * Drop-in upgrade from `memoizeAsync` with dramatically better hit rates.
 *
 * @example
 *   // Before — 0 % hit rate on cold starts:
 *   export const getCachedHorses = memoizeAsync(
 *     () => supabase.from('cavalos_venda').select('*')
 *   );
 *
 *   // After — persistent cache, survives cold starts:
 *   export const getCachedHorses = createServerCache(
 *     () => supabase.from('cavalos_venda').select('*'),
 *     { key: ['cavalos_venda'], revalidate: 60, tags: ['cavalos'] }
 *   );
 */
export function createServerCache<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: ServerCacheOptions
): (...args: TArgs) => Promise<TReturn> {
  const { key, revalidate = 3600, tags } = options;

  return unstable_cache(fn as (...args: unknown[]) => Promise<TReturn>, key, {
    revalidate: revalidate === false ? false : revalidate,
    tags,
  }) as (...args: TArgs) => Promise<TReturn>;
}

/**
 * Upstash Redis cache — for dynamic per-request data where `unstable_cache`
 * doesn't apply (e.g. user-specific data, cart, authenticated queries).
 *
 * Requires UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN env vars.
 * Degrades gracefully: if Redis is unavailable (dev/missing creds), `fn` is
 * called directly with no caching — zero runtime errors.
 *
 * @param cacheKey  Unique key for this cached value
 * @param fn        Async function to cache
 * @param options   { ttl?: seconds (default 300) }
 *
 * @example
 *   const results = await withUpstashCache(
 *     `search:${query}`,
 *     () => fetchSearchResults(query),
 *     { ttl: 60 }
 *   );
 */
export async function withUpstashCache<T>(
  cacheKey: string,
  fn: () => Promise<T>,
  options: { ttl?: number } = {}
): Promise<T> {
  const { ttl = 300 } = options;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // No Redis credentials — fall through to live function (graceful degradation)
  if (!url || !token) return fn();

  try {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({ url, token });

    const cached = await redis.get<T>(cacheKey);
    if (cached !== null) return cached;

    const result = await fn();
    // Upstash setex: key, seconds, value
    await redis.setex(cacheKey, ttl, result as Parameters<typeof redis.setex>[2]);
    return result;
  } catch {
    // Redis error — degrade gracefully to live function
    return fn();
  }
}

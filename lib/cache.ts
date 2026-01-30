// Simple in-memory cache with TTL
class Cache {
  private cache: Map<string, { value: any; expiry: number }>;

  constructor() {
    this.cache = new Map();
  }

  set(key: string, value: any, ttl: number = 3600000): void {
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

export const cache = new Cache();

// Run cleanup every 5 minutes
if (typeof window === "undefined") {
  setInterval(() => {
    cache.cleanup();
  }, 5 * 60 * 1000);
}

// Cache decorator for functions
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 3600000
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = `memoize:${fn.name}:${JSON.stringify(args)}`;
    const cached = cache.get<ReturnType<T>>(key);

    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result, ttl);
    return result;
  }) as T;
}

// Async cache decorator
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  ttl: number = 3600000
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = `memoize:${fn.name}:${JSON.stringify(args)}`;
    const cached = cache.get<ReturnType<T>>(key);

    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    cache.set(key, result, ttl);
    return result;
  }) as T;
}

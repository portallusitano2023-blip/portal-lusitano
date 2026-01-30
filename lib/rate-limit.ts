import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  interval: number;
  uniqueTokenPerInterval: number;
};

export default function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit: number, token: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        if (isRateLimited) {
          reject(
            new Error(
              `Rate limit exceeded. Maximum ${limit} requests per ${options.interval / 1000} seconds.`
            )
          );
        } else {
          resolve();
        }
      }),
  };
}

// Pre-configured rate limiters
export const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export const strictLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100,
});

export const authLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 50,
});

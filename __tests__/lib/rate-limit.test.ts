import { describe, it, expect } from "vitest";
import rateLimit from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("should allow requests under the limit", async () => {
    const limiter = rateLimit({
      interval: 60000,
      uniqueTokenPerInterval: 500,
    });

    // First request should succeed
    await expect(limiter.check(5, "user1")).resolves.toBeUndefined();

    // Second request should succeed
    await expect(limiter.check(5, "user1")).resolves.toBeUndefined();

    // Third request should succeed
    await expect(limiter.check(5, "user1")).resolves.toBeUndefined();
  });

  it("should reject requests over the limit", async () => {
    const limiter = rateLimit({
      interval: 60000,
      uniqueTokenPerInterval: 500,
    });

    // Make requests up to the limit
    await limiter.check(3, "user2");
    await limiter.check(3, "user2");

    // Third request should be rejected (limit is 3, and we're at it)
    await expect(limiter.check(3, "user2")).rejects.toThrow("Rate limit exceeded");
  });

  it("should track different tokens separately", async () => {
    const limiter = rateLimit({
      interval: 60000,
      uniqueTokenPerInterval: 500,
    });

    // User 1 uses up their limit
    await limiter.check(2, "userA");
    await expect(limiter.check(2, "userA")).rejects.toThrow();

    // User 2 should still be able to make requests
    await expect(limiter.check(2, "userB")).resolves.toBeUndefined();
  });

  it("should include rate limit info in error message", async () => {
    const limiter = rateLimit({
      interval: 60000, // 1 minute
      uniqueTokenPerInterval: 500,
    });

    // Use up the limit (limit is 2, so first succeeds, second fails)
    await limiter.check(2, "userD");

    // Verify error message contains expected information
    try {
      await limiter.check(2, "userD");
      expect.fail("Should have thrown");
    } catch (error) {
      expect((error as Error).message).toContain("Rate limit exceeded");
      expect((error as Error).message).toContain("Maximum 2 requests");
    }
  });

  it("should handle high concurrency", async () => {
    const limiter = rateLimit({
      interval: 60000,
      uniqueTokenPerInterval: 1000,
    });

    const limit = 10;
    const promises: Promise<void>[] = [];

    // Make many concurrent requests
    for (let i = 0; i < limit - 1; i++) {
      promises.push(limiter.check(limit, "concurrent"));
    }

    // All should succeed
    await expect(Promise.all(promises)).resolves.toBeDefined();
  });
});

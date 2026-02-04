import { describe, it, expect, beforeEach, vi } from "vitest";
import { cache, memoize, memoizeAsync } from "@/lib/cache";

describe("Cache", () => {
  beforeEach(() => {
    cache.clear();
  });

  describe("set and get", () => {
    it("should store and retrieve values", () => {
      cache.set("key1", "value1");
      expect(cache.get("key1")).toBe("value1");
    });

    it("should store objects", () => {
      const obj = { name: "test", count: 42 };
      cache.set("obj", obj);
      expect(cache.get("obj")).toEqual(obj);
    });

    it("should return null for non-existent keys", () => {
      expect(cache.get("nonexistent")).toBeNull();
    });
  });

  describe("TTL expiration", () => {
    it("should return null for expired items", () => {
      vi.useFakeTimers();

      cache.set("expiring", "value", 1000); // 1 second TTL
      expect(cache.get("expiring")).toBe("value");

      vi.advanceTimersByTime(1001);
      expect(cache.get("expiring")).toBeNull();

      vi.useRealTimers();
    });

    it("should not expire items within TTL", () => {
      vi.useFakeTimers();

      cache.set("notExpiring", "value", 5000);

      vi.advanceTimersByTime(4000);
      expect(cache.get("notExpiring")).toBe("value");

      vi.useRealTimers();
    });
  });

  describe("has", () => {
    it("should return true for existing keys", () => {
      cache.set("exists", "value");
      expect(cache.has("exists")).toBe(true);
    });

    it("should return false for non-existent keys", () => {
      expect(cache.has("doesNotExist")).toBe(false);
    });

    it("should return false for expired keys", () => {
      vi.useFakeTimers();

      cache.set("expired", "value", 100);
      vi.advanceTimersByTime(101);
      expect(cache.has("expired")).toBe(false);

      vi.useRealTimers();
    });
  });

  describe("delete", () => {
    it("should remove items", () => {
      cache.set("toDelete", "value");
      expect(cache.has("toDelete")).toBe(true);

      cache.delete("toDelete");
      expect(cache.has("toDelete")).toBe(false);
    });
  });

  describe("clear", () => {
    it("should remove all items", () => {
      cache.set("key1", "value1");
      cache.set("key2", "value2");
      cache.set("key3", "value3");

      cache.clear();

      expect(cache.has("key1")).toBe(false);
      expect(cache.has("key2")).toBe(false);
      expect(cache.has("key3")).toBe(false);
    });
  });

  describe("cleanup", () => {
    it("should remove only expired items", () => {
      vi.useFakeTimers();

      cache.set("short", "value", 100);
      cache.set("long", "value", 5000);

      vi.advanceTimersByTime(200);
      cache.cleanup();

      expect(cache.has("short")).toBe(false);
      expect(cache.has("long")).toBe(true);

      vi.useRealTimers();
    });
  });
});

describe("memoize", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("should cache function results", () => {
    const expensiveFn = vi.fn((x: number) => x * 2);
    const memoized = memoize(expensiveFn);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);

    // Function should only be called once
    expect(expensiveFn).toHaveBeenCalledTimes(1);
  });

  it("should cache different arguments separately", () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(10)).toBe(20);
    expect(memoized(5)).toBe(10);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should handle multiple arguments", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(2, 1)).toBe(3);

    expect(fn).toHaveBeenCalledTimes(2); // Different arg order = different cache key
  });
});

describe("memoizeAsync", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("should cache async function results", async () => {
    const asyncFn = vi.fn(async (x: number) => {
      return x * 2;
    });
    const memoized = memoizeAsync(asyncFn);

    expect(await memoized(5)).toBe(10);
    expect(await memoized(5)).toBe(10);

    expect(asyncFn).toHaveBeenCalledTimes(1);
  });

  it("should cache different async arguments separately", async () => {
    const asyncFn = vi.fn(async (x: number) => x * 3);
    const memoized = memoizeAsync(asyncFn);

    expect(await memoized(2)).toBe(6);
    expect(await memoized(3)).toBe(9);
    expect(await memoized(2)).toBe(6);

    expect(asyncFn).toHaveBeenCalledTimes(2);
  });
});

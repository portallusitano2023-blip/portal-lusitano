import { describe, it, expect, vi } from "vitest";
import {
  ErrorType,
  ERROR_MESSAGES,
  getErrorType,
  fetchWithErrorHandling,
  withRetry,
  safeJsonParse,
  isNetworkOnline,
} from "@/lib/error-handling";

// ---------------------------------------------------------------------------
// getErrorType
// ---------------------------------------------------------------------------
describe("getErrorType", () => {
  it("returns UNKNOWN for non-Error values", () => {
    expect(getErrorType("string")).toBe(ErrorType.UNKNOWN);
    expect(getErrorType(42)).toBe(ErrorType.UNKNOWN);
    expect(getErrorType(null)).toBe(ErrorType.UNKNOWN);
    expect(getErrorType(undefined)).toBe(ErrorType.UNKNOWN);
    expect(getErrorType({})).toBe(ErrorType.UNKNOWN);
  });

  it("returns TIMEOUT for AbortError", () => {
    // DOMException may not be instanceof Error in jsdom, so use a plain Error with name set
    const error = new Error("The operation was aborted");
    error.name = "AbortError";
    expect(getErrorType(error)).toBe(ErrorType.TIMEOUT);
  });

  it('returns TIMEOUT when message includes "timeout"', () => {
    const error = new Error("Request timeout after 5000ms");
    expect(getErrorType(error)).toBe(ErrorType.TIMEOUT);
  });

  it('returns NETWORK for "Failed to fetch"', () => {
    const error = new Error("Failed to fetch");
    expect(getErrorType(error)).toBe(ErrorType.NETWORK);
  });

  it('returns NETWORK for "NetworkError"', () => {
    const error = new Error("NetworkError when attempting to fetch resource");
    expect(getErrorType(error)).toBe(ErrorType.NETWORK);
  });

  it('returns NETWORK for messages containing "fetch"', () => {
    const error = new Error("fetch failed");
    expect(getErrorType(error)).toBe(ErrorType.NETWORK);
  });

  it("returns NOT_FOUND for status 404", () => {
    const error = Object.assign(new Error("Not found"), { status: 404 });
    expect(getErrorType(error)).toBe(ErrorType.NOT_FOUND);
  });

  it("returns VALIDATION for status 400", () => {
    const error = Object.assign(new Error("Bad request"), { status: 400 });
    expect(getErrorType(error)).toBe(ErrorType.VALIDATION);
  });

  it("returns VALIDATION for status 422", () => {
    const error = Object.assign(new Error("Unprocessable"), { status: 422 });
    expect(getErrorType(error)).toBe(ErrorType.VALIDATION);
  });

  it("returns SERVER for status 500", () => {
    const error = Object.assign(new Error("Internal server error"), { status: 500 });
    expect(getErrorType(error)).toBe(ErrorType.SERVER);
  });

  it("returns SERVER for status 503", () => {
    const error = Object.assign(new Error("Service unavailable"), { status: 503 });
    expect(getErrorType(error)).toBe(ErrorType.SERVER);
  });

  it('returns NOT_FOUND for "Erro 404" in message', () => {
    const error = new Error("Erro 404: Pagina nao encontrada");
    expect(getErrorType(error)).toBe(ErrorType.NOT_FOUND);
  });

  it('returns VALIDATION for "Erro 422" in message', () => {
    const error = new Error("Erro 422: Dados invalidos");
    expect(getErrorType(error)).toBe(ErrorType.VALIDATION);
  });

  it('returns SERVER for "Erro 500" in message', () => {
    const error = new Error("Erro 500: Erro interno");
    expect(getErrorType(error)).toBe(ErrorType.SERVER);
  });

  it("returns UNKNOWN for a generic Error", () => {
    const error = new Error("Something went wrong");
    expect(getErrorType(error)).toBe(ErrorType.UNKNOWN);
  });
});

// ---------------------------------------------------------------------------
// ERROR_MESSAGES
// ---------------------------------------------------------------------------
describe("ERROR_MESSAGES", () => {
  it("has a message for every ErrorType", () => {
    for (const type of Object.values(ErrorType)) {
      expect(ERROR_MESSAGES[type]).toBeDefined();
      expect(typeof ERROR_MESSAGES[type]).toBe("string");
      expect(ERROR_MESSAGES[type].length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// fetchWithErrorHandling
// ---------------------------------------------------------------------------
describe("fetchWithErrorHandling", () => {
  it("returns data on success", async () => {
    const result = await fetchWithErrorHandling(() => Promise.resolve({ id: 1 }));
    expect(result.data).toEqual({ id: 1 });
    expect(result.error).toBeNull();
    expect(result.errorType).toBeNull();
  });

  it("returns error on failure", async () => {
    const result = await fetchWithErrorHandling(() => Promise.reject(new Error("Failed to fetch")));
    expect(result.data).toBeNull();
    expect(result.error).toBeDefined();
    expect(result.errorType).toBe(ErrorType.NETWORK);
  });

  it("calls onSuccess callback on success", async () => {
    const onSuccess = vi.fn();
    await fetchWithErrorHandling(() => Promise.resolve("ok"), { onSuccess });
    expect(onSuccess).toHaveBeenCalledWith("ok");
  });

  it("calls onError callback on failure", async () => {
    const onError = vi.fn();
    const error = new Error("boom");
    await fetchWithErrorHandling(() => Promise.reject(error), { onError });
    expect(onError).toHaveBeenCalled();
  });

  it("uses fallback value on error", async () => {
    const result = await fetchWithErrorHandling(() => Promise.reject(new Error("fail")), {
      fallback: "default",
    });
    expect(result.data).toBe("default");
  });
});

// ---------------------------------------------------------------------------
// withRetry
// ---------------------------------------------------------------------------
describe("withRetry", () => {
  it("succeeds on the first try without retries", async () => {
    const fn = vi.fn().mockResolvedValue("success");
    const result = await withRetry(fn);
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on failure then succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("Erro 500"))
      .mockResolvedValueOnce("recovered");

    const result = await withRetry(fn, { maxRetries: 3, baseDelay: 0 });
    expect(result).toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws after exhausting max retries", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("Erro 500"));

    await expect(withRetry(fn, { maxRetries: 2, baseDelay: 0 })).rejects.toThrow();
    // 1 initial + 2 retries = 3
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("does NOT retry on NOT_FOUND errors", async () => {
    const error = Object.assign(new Error("Not found"), { status: 404 });
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn, { maxRetries: 3, baseDelay: 0 })).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry on VALIDATION errors", async () => {
    const error = Object.assign(new Error("Bad request"), { status: 400 });
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn, { maxRetries: 3, baseDelay: 0 })).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("calls onRetry callback on each retry", async () => {
    const onRetry = vi.fn();
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("Erro 500"))
      .mockRejectedValueOnce(new Error("Erro 500"))
      .mockResolvedValueOnce("ok");

    await withRetry(fn, { maxRetries: 3, baseDelay: 0, onRetry });
    expect(onRetry).toHaveBeenCalledTimes(2);
  });
});

// ---------------------------------------------------------------------------
// safeJsonParse
// ---------------------------------------------------------------------------
describe("safeJsonParse", () => {
  it("parses valid JSON", () => {
    expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 });
    expect(safeJsonParse("[1,2,3]", [])).toEqual([1, 2, 3]);
    expect(safeJsonParse('"hello"', "")).toBe("hello");
    expect(safeJsonParse("42", 0)).toBe(42);
  });

  it("returns fallback on invalid JSON", () => {
    expect(safeJsonParse("not json", "fallback")).toBe("fallback");
    expect(safeJsonParse("{broken", {})).toEqual({});
    expect(safeJsonParse("", null)).toBeNull();
    expect(safeJsonParse(undefined as unknown as string, "default")).toBe("default");
  });
});

// ---------------------------------------------------------------------------
// isNetworkOnline
// ---------------------------------------------------------------------------
describe("isNetworkOnline", () => {
  it("returns true when navigator.onLine is true", () => {
    Object.defineProperty(globalThis.navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });
    expect(isNetworkOnline()).toBe(true);
  });

  it("returns false when navigator.onLine is false", () => {
    Object.defineProperty(globalThis.navigator, "onLine", {
      value: false,
      writable: true,
      configurable: true,
    });
    expect(isNetworkOnline()).toBe(false);
  });
});

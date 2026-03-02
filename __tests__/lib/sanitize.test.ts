import { describe, it, expect, vi } from "vitest";
import {
  sanitizeSearchInput,
  escapeHtml,
  generateUnsubscribeToken,
  verifyUnsubscribeToken,
} from "@/lib/sanitize";

describe("sanitizeSearchInput", () => {
  it("allows normal Portuguese text", () => {
    expect(sanitizeSearchInput("Cavalo Lusitano")).toBe("Cavalo Lusitano");
    expect(sanitizeSearchInput("São João")).toBe("São João");
    expect(sanitizeSearchInput("Coudelaria Veiga-Alter")).toBe("Coudelaria Veiga-Alter");
  });

  it("strips SQL/PostgREST injection characters", () => {
    expect(sanitizeSearchInput("test;DROP TABLE")).toBe("testDROP TABLE");
    expect(sanitizeSearchInput("name.ilike.%hack%")).toBe("nameilikehack");
    expect(sanitizeSearchInput("a'OR'1'='1")).toBe("aOR11");
    expect(sanitizeSearchInput('test"OR"1"="1')).toBe("testOR11");
    expect(sanitizeSearchInput("test`injection`")).toBe("testinjection");
  });

  it("strips parentheses and commas (PostgREST operators)", () => {
    expect(sanitizeSearchInput("nome,descricao")).toBe("nomedescricao");
    expect(sanitizeSearchInput("eq(name)")).toBe("eqname");
  });

  it("truncates to 100 characters", () => {
    const longInput = "a".repeat(200);
    expect(sanitizeSearchInput(longInput).length).toBe(100);
  });

  it("trims whitespace", () => {
    expect(sanitizeSearchInput("  cavalo  ")).toBe("cavalo");
  });

  it("handles empty input", () => {
    expect(sanitizeSearchInput("")).toBe("");
  });

  it("preserves accented characters (À-ÿ)", () => {
    expect(sanitizeSearchInput("àáâãäåèéêëìíîïòóôõöùúûüýÿ")).toBe(
      "àáâãäåèéêëìíîïòóôõöùúûüýÿ"
    );
  });
});

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#039;s");
  });
});

describe("Unsubscribe tokens", () => {
  it("generates consistent tokens for same email", () => {
    vi.stubEnv("ADMIN_SECRET", "test-secret-key-for-testing");
    const token1 = generateUnsubscribeToken("test@example.com");
    const token2 = generateUnsubscribeToken("test@example.com");
    expect(token1).toBe(token2);
  });

  it("generates different tokens for different emails", () => {
    vi.stubEnv("ADMIN_SECRET", "test-secret-key-for-testing");
    const token1 = generateUnsubscribeToken("user1@example.com");
    const token2 = generateUnsubscribeToken("user2@example.com");
    expect(token1).not.toBe(token2);
  });

  it("verifies valid token", () => {
    vi.stubEnv("ADMIN_SECRET", "test-secret-key-for-testing");
    const email = "test@example.com";
    const token = generateUnsubscribeToken(email);
    expect(verifyUnsubscribeToken(email, token)).toBe(true);
  });

  it("rejects invalid token", () => {
    vi.stubEnv("ADMIN_SECRET", "test-secret-key-for-testing");
    expect(() => verifyUnsubscribeToken("test@example.com", "invalid-token")).toThrow();
  });

  it("normalises email case", () => {
    vi.stubEnv("ADMIN_SECRET", "test-secret-key-for-testing");
    const token = generateUnsubscribeToken("Test@Example.COM");
    expect(verifyUnsubscribeToken("test@example.com", token)).toBe(true);
  });

  it("throws when no secret is configured", () => {
    vi.stubEnv("ADMIN_SECRET", "");
    vi.stubEnv("UNSUBSCRIBE_SECRET", "");
    expect(() => generateUnsubscribeToken("test@example.com")).toThrow();
  });
});

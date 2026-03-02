import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Logger PII Redaction", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("redacts email addresses in production", async () => {
    process.env.NODE_ENV = "production";
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { logger } = await import("@/lib/logger");
    logger.info("User login: user@example.com attempted access");

    expect(consoleSpy).toHaveBeenCalled();
    const logOutput = consoleSpy.mock.calls[0][0];
    expect(logOutput).toContain("[EMAIL_REDACTED]");
    expect(logOutput).not.toContain("user@example.com");

    consoleSpy.mockRestore();
  });

  it("redacts phone numbers in production", async () => {
    process.env.NODE_ENV = "production";
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { logger } = await import("@/lib/logger");
    logger.info("Contact phone: 912345678");

    expect(consoleSpy).toHaveBeenCalled();
    const logOutput = consoleSpy.mock.calls[0][0];
    expect(logOutput).toContain("[PHONE_REDACTED]");
    expect(logOutput).not.toContain("912345678");

    consoleSpy.mockRestore();
  });

  it("does not redact in development", async () => {
    process.env.NODE_ENV = "development";
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { logger } = await import("@/lib/logger");
    logger.info("User login: user@example.com");

    expect(consoleSpy).toHaveBeenCalled();
    // In dev mode, console output includes the raw message
    const allArgs = consoleSpy.mock.calls[0].join(" ");
    expect(allArgs).toContain("user@example.com");

    consoleSpy.mockRestore();
  });
});

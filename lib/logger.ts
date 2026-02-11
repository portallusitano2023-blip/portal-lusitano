/**
 * Structured logger for Portal Lusitano.
 *
 * - In development: colourful console output with timestamps.
 * - In production: JSON-formatted output (easy to pipe to Sentry / Datadog / etc.).
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.info("Horse loaded", { id: 123 });
 *   logger.error("Failed to fetch", error);
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isDev = process.env.NODE_ENV !== "production";
const minLevel: LogLevel = isDev ? "debug" : "info";

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[minLevel];
}

function formatArgs(args: unknown[]): unknown[] {
  return args.map((arg) => {
    if (arg instanceof Error) {
      return { message: arg.message, stack: arg.stack, name: arg.name };
    }
    return arg;
  });
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  if (!shouldLog(level)) return;

  if (isDev) {
    const timestamp = new Date().toISOString().slice(11, 23);
    const prefix = `[${timestamp}] ${level.toUpperCase().padEnd(5)}`;
    const consoleFn =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : level === "debug"
            ? console.debug
            : console.log;
    consoleFn(prefix, message, ...args);
  } else {
    // Production: structured JSON for log aggregation
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(args.length === 1 && typeof args[0] === "object" && args[0] !== null
        ? (args[0] as Record<string, unknown>)
        : args.length > 0
          ? { data: formatArgs(args) }
          : {}),
    };
    const consoleFn =
      level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    consoleFn(JSON.stringify(entry));
  }
}

export const logger = {
  debug: (message: string, ...args: unknown[]) => log("debug", message, ...args),
  info: (message: string, ...args: unknown[]) => log("info", message, ...args),
  warn: (message: string, ...args: unknown[]) => log("warn", message, ...args),
  error: (message: string, ...args: unknown[]) => log("error", message, ...args),
};

/**
 * Sentry Configuration
 *
 * Error tracking and performance monitoring
 * Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from "@sentry/nextjs";
import { logger } from "@/lib/logger";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENV = process.env.NODE_ENV;
const VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV;

export function initSentry() {
  if (!SENTRY_DSN) {
    logger.warn("Sentry DSN not configured");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment
    environment: VERCEL_ENV || ENV,

    // Performance Monitoring
    tracesSampleRate: ENV === "production" ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Integrations (v10 API)
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Release tracking
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

    // Filter out noise
    ignoreErrors: [
      "top.GLOBALS",
      "ResizeObserver loop limit exceeded",
      "NetworkError",
      "Failed to fetch",
      "AbortError",
    ],

    // Strip sensitive data
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers.cookie;
        delete event.request.headers.authorization;
      }
      return event;
    },
  });
}

/**
 * Track custom event
 */
export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  Sentry.captureMessage(eventName, {
    level: "info",
    extra: data,
  });
}

/**
 * Track error manually
 */
export function trackError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Set user context
 */
export function setUser(user: { id?: string; email?: string; name?: string }) {
  Sentry.setUser(user);
}

/**
 * Clear user context (on logout)
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb (for debugging)
 */
export function addBreadcrumb(message: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    message,
    data,
    level: "info",
  });
}

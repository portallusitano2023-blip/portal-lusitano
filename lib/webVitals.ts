import type { Metric } from "web-vitals";
import { logger } from "@/lib/logger";

// Enviar metricas para Google Analytics 4
const sendToAnalytics = (metric: Metric) => {
  if (process.env.NODE_ENV === "development") {
    logger.debug(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}`);
  }

  // Enviar para GA4
  window.gtag?.("event", metric.name, {
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
};

// Send vitals to our custom analytics API endpoint
const sendToCustomAnalytics = (metric: Metric) => {
  try {
    const payload = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType:
        "navigationType" in metric
          ? (metric as unknown as Record<string, unknown>).navigationType
          : undefined,
    };

    // Use sendBeacon for reliability (survives page navigation)
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/vitals", JSON.stringify(payload));
    } else {
      // Fallback to fetch for browsers without sendBeacon
      fetch("/api/analytics/vitals", {
        method: "POST",
        body: JSON.stringify(payload),
        keepalive: true, // Ensures request completes even if page unloads
      }).catch((error) => {
        if (process.env.NODE_ENV === "development") {
          logger.debug("Failed to send Web Vital to analytics", { error: error.message });
        }
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      logger.debug("Error preparing Web Vital payload", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};

export function reportWebVitals(metric: Metric) {
  // All metrics are sent to both GA4 and our custom analytics endpoint
  sendToAnalytics(metric);
  sendToCustomAnalytics(metric);
}

// Inicializar Web Vitals
export async function initWebVitals() {
  if (typeof window !== "undefined") {
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import("web-vitals");

    onCLS(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
    onINP(reportWebVitals);
  }
}

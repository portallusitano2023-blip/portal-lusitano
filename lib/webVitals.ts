import type { Metric } from "web-vitals";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Enviar metricas para Google Analytics 4
const sendToAnalytics = (metric: Metric) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}`);
  }

  // Enviar para GA4
  window.gtag?.("event", metric.name, {
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
};

export function reportWebVitals(metric: Metric) {
  switch (metric.name) {
    case "CLS": // Cumulative Layout Shift - deve ser < 0.1
      sendToAnalytics(metric);
      break;
    case "FCP": // First Contentful Paint - deve ser < 1.8s
      sendToAnalytics(metric);
      break;
    case "LCP": // Largest Contentful Paint - deve ser < 2.5s
      sendToAnalytics(metric);
      break;
    case "TTFB": // Time to First Byte - deve ser < 800ms
      sendToAnalytics(metric);
      break;
    case "INP": // Interaction to Next Paint - deve ser < 200ms (substitui FID)
      sendToAnalytics(metric);
      break;
    default:
      sendToAnalytics(metric);
  }
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

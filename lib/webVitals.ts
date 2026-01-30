import type { Metric } from 'web-vitals';

// Funcao para enviar metricas para analytics
const sendToAnalytics = (metric: Metric) => {
  // Em producao, enviar para Google Analytics, Vercel Analytics, etc.
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}`);
  }

  // Exemplo: enviar para Google Analytics
  // window.gtag?.('event', metric.name, {
  //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //   event_label: metric.id,
  //   non_interaction: true,
  // });

  // Exemplo: enviar para Vercel Analytics
  // window.va?.('vitals', { name: metric.name, value: metric.value });
};

export function reportWebVitals(metric: Metric) {
  switch (metric.name) {
    case 'CLS': // Cumulative Layout Shift - deve ser < 0.1
      sendToAnalytics(metric);
      break;
    case 'FID': // First Input Delay - deve ser < 100ms
      sendToAnalytics(metric);
      break;
    case 'FCP': // First Contentful Paint - deve ser < 1.8s
      sendToAnalytics(metric);
      break;
    case 'LCP': // Largest Contentful Paint - deve ser < 2.5s
      sendToAnalytics(metric);
      break;
    case 'TTFB': // Time to First Byte - deve ser < 800ms
      sendToAnalytics(metric);
      break;
    case 'INP': // Interaction to Next Paint - deve ser < 200ms
      sendToAnalytics(metric);
      break;
    default:
      sendToAnalytics(metric);
  }
}

// Inicializar Web Vitals
export async function initWebVitals() {
  if (typeof window !== 'undefined') {
    const { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');

    onCLS(reportWebVitals);
    onFID(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
    onINP(reportWebVitals);
  }
}

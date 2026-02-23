// Lazy-load Sentry to avoid ~30-70KB in the initial client bundle.
// The dynamic import runs after hydration, so Sentry does not block TTI.
async function initSentry() {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window !== "undefined" && window.location.hostname === "localhost") return;

  const Sentry = await import("@sentry/nextjs");

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: true,

    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% das transacoes

    // Session Replay desactivado para performance
    // ~150KB de JS que não precisa de carregar no cliente
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    // Ignorar erros comuns
    ignoreErrors: [
      // Erros de rede
      "Network request failed",
      "Failed to fetch",
      "NetworkError",
      "AbortError",
      // Erros de browser
      "ResizeObserver loop",
      "Non-Error promise rejection",
      // Extensoes de browser
      "chrome-extension://",
      "moz-extension://",
    ],

    // Configuracoes adicionais
    beforeSend(event) {
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        return null;
      }
      return event;
    },
  });
}

initSentry();

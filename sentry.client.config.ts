import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Desativar em desenvolvimento
  enabled: process.env.NODE_ENV === "production",

  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% das transacoes

  // Session Replay (opcional)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

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
    // Nao enviar erros em localhost
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      return null;
    }
    return event;
  },
});

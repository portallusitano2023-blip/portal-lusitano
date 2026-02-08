import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

interface ApiErrorOptions {
  status?: number;
  details?: string;
  logToSentry?: boolean;
}

/**
 * Resposta de sucesso padronizada para API routes.
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Resposta de erro padronizada para API routes.
 * Captura automaticamente no Sentry quando logToSentry=true (default).
 */
export function apiError(message: string, options: ApiErrorOptions = {}) {
  const { status = 500, details, logToSentry = status >= 500 } = options;

  if (logToSentry) {
    Sentry.captureMessage(message, {
      level: "error",
      extra: { details, status },
    });
  }

  const body: { error: string; details?: string } = { error: message };
  if (details) {
    body.details = details;
  }

  return NextResponse.json(body, { status });
}

/**
 * Handler para erros não esperados em API routes.
 * Captura a excepção no Sentry e retorna resposta padronizada.
 */
export function handleApiError(error: unknown) {
  Sentry.captureException(error);

  const message = error instanceof Error ? error.message : "Erro interno do servidor";

  return apiError(message, { status: 500, logToSentry: false });
}

import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./auth";
import { logger } from "./logger";

// Standard API response format
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

export function apiSuccess<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  const response: ApiResponse<T> = { data };
  if (meta) response.meta = meta;
  return NextResponse.json(response, { status });
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message } satisfies ApiResponse, { status });
}

// Admin auth middleware wrapper
type AdminHandler = (
  req: NextRequest,
  context: { email: string; params?: Record<string, string> }
) => Promise<NextResponse>;

/**
 * @deprecated Use `createApiRoute(handler, { auth: "admin" })` from `@/lib/createApiRoute` instead.
 * This wrapper is kept for backward compatibility with older routes.
 */
export function withAdminAuth(handler: AdminHandler) {
  return async (req: NextRequest, routeContext?: { params?: Promise<Record<string, string>> }) => {
    try {
      const email = await verifySession();
      if (!email) {
        return apiError("Não autorizado", 401);
      }
      const params = routeContext?.params ? await routeContext.params : undefined;
      return await handler(req, { email, params });
    } catch (error) {
      logger.error("API error:", error);
      return apiError("Erro interno do servidor", 500);
    }
  };
}

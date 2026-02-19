import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export function apiSuccess<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status = 500, context?: string) {
  if (context) logger.error(`[API ${context}] ${message}`);
  return NextResponse.json({ error: message }, { status });
}

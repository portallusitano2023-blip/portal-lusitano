import { NextResponse } from "next/server";

/**
 * Standardized API response format
 * All API routes should use these helpers to maintain consistency
 */

export interface ApiSuccessResponse<T = unknown> {
  ok: true;
  data: T;
  timestamp?: number;
}

export interface ApiErrorResponse {
  ok: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp?: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiResponseBuilder {
  /**
   * Create a successful response
   * @param data Response payload
   * @param options Configuration options
   * @returns Standardized success response
   *
   * @example
   * ```typescript
   * return apiResponse.ok({ id: 1, name: "John" });
   * // { ok: true, data: { id: 1, name: "John" } }
   * ```
   */
  static ok<T>(data: T, options?: { timestamp?: boolean }): ApiSuccessResponse<T> {
    return {
      ok: true,
      data,
      ...(options?.timestamp && { timestamp: Date.now() }),
    };
  }

  /**
   * Create an error response
   * @param message Error message for client
   * @param options Configuration options including code and details
   * @returns Standardized error response
   *
   * @example
   * ```typescript
   * return apiResponse.error("User not found", { code: "NOT_FOUND" });
   * // { ok: false, error: "User not found", code: "NOT_FOUND" }
   * ```
   */
  static error(
    message: string,
    options?: {
      code?: string;
      details?: Record<string, unknown>;
      timestamp?: boolean;
    }
  ): ApiErrorResponse {
    return {
      ok: false,
      error: message,
      ...(options?.code && { code: options.code }),
      ...(options?.details && { details: options.details }),
      ...(options?.timestamp && { timestamp: Date.now() }),
    };
  }

  /**
   * Create a NextResponse with proper status code
   * @param response API response object
   * @param status HTTP status code
   * @returns NextResponse ready to send to client
   */
  static toResponse<T>(response: ApiResponse<T>, status: number = 200): NextResponse {
    return NextResponse.json(response, { status });
  }
}

export const apiResponse = ApiResponseBuilder;

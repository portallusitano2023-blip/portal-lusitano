import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { z } from "zod";
import type { Json } from "@/lib/database.types";

// Configurable via env var — allows A/B testing different free tier limits
const FREE_USES_PER_TOOL = parseInt(process.env.FREE_USES_PER_TOOL || "1", 10);

const jsonValue: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValue),
    z.record(z.string(), jsonValue),
  ])
);

const bodySchema = z.object({
  toolName: z.enum(["calculadora", "comparador", "compatibilidade", "perfil"]),
  /** When true, also records a usage entry (atomic validate + record) */
  record: z.boolean().optional(),
  formData: z.record(z.string(), jsonValue).optional(),
  resultData: z.record(z.string(), jsonValue).optional(),
});

/**
 * POST /api/tools/validate-access
 *
 * Server-side validation of tool access. Called before every calculation
 * to prevent client-side bypass of the paywall.
 *
 * When `record: true`, atomically checks access AND inserts a usage row,
 * ensuring the user can't skip recording usage.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ allowed: false, reason: "not_authenticated" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ allowed: false, reason: "invalid_request" }, { status: 400 });
    }

    const { toolName, record, formData, resultData } = parsed.data;

    // Check subscription status
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("tools_subscription_status")
      .eq("id", user.id)
      .single();

    const isSubscribed = profile?.tools_subscription_status === "active";

    if (isSubscribed) {
      // Subscriber — always allowed. Record usage if requested (for analytics).
      if (record) {
        await supabase.from("tool_usage").insert({
          user_id: user.id,
          tool_name: toolName,
          form_data: (formData as Json) || null,
          result_data: (resultData as Json) || null,
        });
      }
      return NextResponse.json({
        allowed: true,
        isSubscribed: true,
        freeUsesLeft: Infinity,
      });
    }

    // Non-subscriber — check usage count
    const { count } = await supabase
      .from("tool_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("tool_name", toolName);

    const usageCount = count ?? 0;
    const freeUsesLeft = Math.max(0, FREE_USES_PER_TOOL - usageCount);

    if (freeUsesLeft <= 0) {
      return NextResponse.json({
        allowed: false,
        reason: "limit_reached",
        isSubscribed: false,
        freeUsesLeft: 0,
      });
    }

    // Has free uses — allowed
    if (record) {
      // Record usage atomically
      const { error: insertError } = await supabase.from("tool_usage").insert({
        user_id: user.id,
        tool_name: toolName,
        form_data: formData || null,
        result_data: resultData || null,
      });

      if (insertError) {
        // If insert fails, still allow (don't block user) but log
        console.error("[validate-access] Failed to record usage:", insertError.message);
      }

      const newFreeUsesLeft = Math.max(0, FREE_USES_PER_TOOL - (usageCount + 1));

      // Trigger limit-reached email if this exhausted their free uses (non-blocking)
      if (newFreeUsesLeft <= 0) {
        fetch(new URL("/api/tools/limit-reached", request.url).toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: request.headers.get("Cookie") || "",
          },
          body: JSON.stringify({ toolSlug: toolName }),
        }).catch(() => {});
      }

      return NextResponse.json({
        allowed: true,
        isSubscribed: false,
        freeUsesLeft: newFreeUsesLeft,
      });
    }

    return NextResponse.json({
      allowed: true,
      isSubscribed: false,
      freeUsesLeft,
    });
  } catch (error) {
    console.error("[validate-access] Unexpected error:", error);
    // SECURITY: On error, DENY access (not permissive)
    return NextResponse.json({ allowed: false, reason: "server_error" }, { status: 500 });
  }
}

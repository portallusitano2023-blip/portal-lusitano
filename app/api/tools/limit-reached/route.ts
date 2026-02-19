import { NextRequest, NextResponse } from "next/server";
import { EmailWorkflows } from "@/lib/resend";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { z } from "zod";

const bodySchema = z.object({
  toolSlug: z.enum(["calculadora", "comparador", "compatibilidade", "perfil"]),
});

// How many free uses each tool allows — must match hooks/useToolAccess.ts
const FREE_USES_PER_TOOL = 1;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ ok: false });
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { toolSlug } = parsed.data;

    // DB-based deduplication: only send when the user hits the limit for the first time.
    // In-memory Maps reset on serverless cold starts; this approach is durable.
    const { count } = await supabase
      .from("tool_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("tool_name", toolSlug);

    if ((count ?? 0) !== FREE_USES_PER_TOOL) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const name = user.user_metadata?.full_name || user.email.split("@")[0];
    const result = await EmailWorkflows.sendToolLimitReached(user.email, name, toolSlug);

    return NextResponse.json({ ok: result.success });
  } catch (error) {
    logger.error("Tool limit email error:", error);
    return NextResponse.json({ ok: false });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { EmailWorkflows } from "@/lib/resend";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { z } from "zod";

const bodySchema = z.object({
  toolSlug: z.enum(["calculadora", "comparador", "compatibilidade", "perfil"]),
});

// Mapa simples para evitar envios duplicados (1 email por tool por user por dia)
const sentMap = new Map<string, number>();
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 horas

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
    const key = `${user.email}:${toolSlug}`;
    const lastSent = sentMap.get(key);
    if (lastSent && Date.now() - lastSent < COOLDOWN_MS) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const name = user.user_metadata?.full_name || user.email.split("@")[0];
    const result = await EmailWorkflows.sendToolLimitReached(user.email, name, toolSlug);

    if (result.success) {
      sentMap.set(key, Date.now());
    }

    return NextResponse.json({ ok: result.success });
  } catch (error) {
    logger.error("Tool limit email error:", error);
    return NextResponse.json({ ok: false });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { EmailWorkflows } from "@/lib/resend";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Rate limit simples (sem Redis — apenas protecção básica)
const recentlySent = new Map<string, number>();
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hora por email

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Evitar envios duplicados (cooldown de 1 hora)
    const lastSent = recentlySent.get(user.email);
    if (lastSent && Date.now() - lastSent < COOLDOWN_MS) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const name = user.user_metadata?.full_name || user.email.split("@")[0];

    const result = await EmailWorkflows.sendRegistrationWelcome(user.email, name);

    if (result.success) {
      recentlySent.set(user.email, Date.now());
      // Limpeza periódica do mapa para evitar memory leak
      if (recentlySent.size > 10000) {
        const cutoff = Date.now() - COOLDOWN_MS;
        for (const [email, ts] of recentlySent.entries()) {
          if (ts < cutoff) recentlySent.delete(email);
        }
      }
    }

    return NextResponse.json({ ok: result.success });
  } catch (error) {
    logger.error("Registration welcome email error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

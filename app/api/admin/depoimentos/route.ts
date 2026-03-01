import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Listar depoimentos pendentes
export async function GET(_req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: pendentes, error } = await supabase
      .from("depoimentos_cavalos")
      .select("*, cavalos_venda(nome_cavalo)")
      .eq("status", "pendente")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ pendentes: pendentes || [] });
  } catch (error) {
    logger.error("Error fetching depoimentos:", error);
    return NextResponse.json({ error: "Erro ao carregar depoimentos" }, { status: 500 });
  }
}

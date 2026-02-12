import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Listar logs de uma automação específica
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const automation_id = searchParams.get("automation_id");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!automation_id) {
      return NextResponse.json({ error: "automation_id é obrigatório" }, { status: 400 });
    }

    // Buscar logs
    const { data: logs, error } = await supabase
      .from("admin_automation_logs")
      .select("*")
      .eq("automation_id", automation_id)
      .order("executed_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    logger.error("Error fetching automation logs:", error);
    return NextResponse.json(
      {
        error: "Erro ao carregar logs",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

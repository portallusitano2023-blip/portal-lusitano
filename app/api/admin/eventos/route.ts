import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Listar todos os eventos (admin)
export async function GET() {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("data_inicio", { ascending: false });

    if (error) {
      logger.error("Erro ao buscar eventos:", error);
      return NextResponse.json({ error: "Erro ao buscar eventos" }, { status: 500 });
    }

    return NextResponse.json({ eventos: data });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST - Criar novo evento
export async function POST(request: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("eventos")
      .insert({
        ...body,
        status: "active",
        views_count: 0,
      })
      .select()
      .single();

    if (error) {
      logger.error("Erro ao criar evento:", error);
      return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
    }

    return NextResponse.json({ evento: data });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

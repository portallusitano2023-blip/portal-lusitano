import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Listar todos os eventos (admin)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("data_inicio", { ascending: false });

    if (error) {
      console.error("Erro ao buscar eventos:", error);
      return NextResponse.json(
        { error: "Erro ao buscar eventos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ eventos: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar novo evento
export async function POST(request: NextRequest) {
  try {
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
      console.error("Erro ao criar evento:", error);
      return NextResponse.json(
        { error: "Erro ao criar evento" },
        { status: 500 }
      );
    }

    return NextResponse.json({ evento: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

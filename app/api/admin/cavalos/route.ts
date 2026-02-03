import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Listar todos os cavalos (admin)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("cavalos_venda")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar cavalos:", error);
      return NextResponse.json(
        { error: "Erro ao buscar cavalos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ cavalos: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar novo anúncio de cavalo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("cavalos_venda")
      .insert({
        ...body,
        status: "active",
        views_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar anúncio:", error);
      return NextResponse.json(
        { error: "Erro ao criar anúncio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ cavalo: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

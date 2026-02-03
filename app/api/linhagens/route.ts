import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Listar linhagens
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("linhagens")
      .select("*")
      .order("nome", { ascending: true });

    if (error) {
      console.error("Erro ao buscar linhagens:", error);
      return NextResponse.json(
        { error: "Erro ao buscar linhagens" },
        { status: 500 }
      );
    }

    return NextResponse.json({ linhagens: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

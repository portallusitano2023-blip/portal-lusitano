import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Listar eventos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const regiao = searchParams.get("regiao");
    const mes = searchParams.get("mes");
    const ano = searchParams.get("ano");

    let query = supabase
      .from("eventos")
      .select("*")
      .eq("status", "active")
      .gte("data_inicio", new Date().toISOString().split("T")[0])
      .order("data_inicio", { ascending: true });

    if (tipo && tipo !== "todos") {
      query = query.eq("tipo", tipo);
    }

    if (regiao && regiao !== "Todas") {
      query = query.eq("regiao", regiao);
    }

    if (mes && ano) {
      const startDate = `${ano}-${mes.padStart(2, "0")}-01`;
      const endDate = `${ano}-${mes.padStart(2, "0")}-31`;
      query = query.gte("data_inicio", startDate).lte("data_inicio", endDate);
    }

    const { data, error } = await query;

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

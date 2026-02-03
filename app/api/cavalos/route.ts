import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Listar cavalos à venda
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sexo = searchParams.get("sexo");
    const regiao = searchParams.get("regiao");
    const precoMin = searchParams.get("precoMin");
    const precoMax = searchParams.get("precoMax");
    const nivel = searchParams.get("nivel");
    const disciplina = searchParams.get("disciplina");
    const search = searchParams.get("search");

    let query = supabase
      .from("cavalos_venda")
      .select("*, coudelarias(nome, slug)")
      .eq("status", "active")
      .order("destaque", { ascending: false })
      .order("created_at", { ascending: false });

    if (sexo && sexo !== "todos") {
      query = query.eq("sexo", sexo);
    }

    if (regiao && regiao !== "Todas") {
      query = query.eq("regiao", regiao);
    }

    if (precoMin) {
      query = query.gte("preco", parseFloat(precoMin));
    }

    if (precoMax) {
      query = query.lte("preco", parseFloat(precoMax));
    }

    if (nivel && nivel !== "todos") {
      query = query.eq("nivel_treino", nivel);
    }

    if (disciplina && disciplina !== "todas") {
      query = query.contains("disciplinas", [disciplina]);
    }

    if (search) {
      query = query.or(`nome.ilike.%${search}%,descricao.ilike.%${search}%`);
    }

    const { data, error } = await query;

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

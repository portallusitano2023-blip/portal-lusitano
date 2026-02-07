import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

// GET - Listar profissionais com filtros
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const tipo = searchParams.get("tipo") || "all";
    const status = searchParams.get("status") || "all";
    const plano = searchParams.get("plano") || "all";
    const search = searchParams.get("search") || "";

    // Buscar todos os profissionais (não-deletados)
    let query = supabase
      .from("profissionais")
      .select("*", { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    // Filtros
    if (tipo !== "all") {
      query = query.eq("tipo", tipo);
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (plano !== "all") {
      query = query.eq("plano", plano);
    }

    // Pesquisa
    if (search) {
      query = query.or(
        `nome.ilike.%${search}%,cidade.ilike.%${search}%,especialidade.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data: profissionais, error, count } = await query;

    if (error) throw error;

    // Calcular estatísticas
    const all = profissionais || [];
    const stats = {
      total: count || 0,
      pendente: all.filter((p) => p.status === "pendente").length,
      aprovado: all.filter((p) => p.status === "aprovado").length,
      rejeitado: all.filter((p) => p.status === "rejeitado").length,
      suspenso: all.filter((p) => p.status === "suspenso").length,
      gratis: all.filter((p) => p.plano === "gratis").length,
      bronze: all.filter((p) => p.plano === "bronze").length,
      prata: all.filter((p) => p.plano === "prata").length,
      ouro: all.filter((p) => p.plano === "ouro").length,
      ativos: all.filter((p) => p.plano_ativo).length,
      destaque: all.filter((p) => p.destaque).length,
      veterinario: all.filter((p) => p.tipo === "veterinario").length,
      treinador: all.filter((p) => p.tipo === "treinador").length,
      ferrador: all.filter((p) => p.tipo === "ferrador").length,
    };

    // Calcular receita mensal recorrente (MRR)
    const mrr = all
      .filter((p) => p.plano_ativo)
      .reduce((sum, p) => sum + (p.plano_valor || 0), 0);

    return NextResponse.json({
      profissionais,
      stats,
      mrr,
      count,
    });
  } catch (error) {
    console.error("Error fetching profissionais:", error);
    return NextResponse.json(
      { error: "Erro ao carregar profissionais", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

// POST - Criar novo profissional
export async function POST(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();

    // Validações
    if (!body.nome || !body.tipo) {
      return NextResponse.json(
        { error: "Nome e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar profissional
    const { data: profissional, error } = await supabase
      .from("profissionais")
      .insert({
        ...body,
        plano_inicio: body.plano_inicio ? new Date(body.plano_inicio).toISOString() : null,
        plano_fim: body.plano_fim ? new Date(body.plano_fim).toISOString() : null,
        created_by: email,
      })
      .select()
      .single();

    if (error) throw error;

    // Se tem plano pago, criar histórico
    if (body.plano && body.plano !== "gratis" && body.plano_inicio && body.plano_fim) {
      await supabase.from("profissionais_subscription_historico").insert({
        profissional_id: profissional.id,
        plano: body.plano,
        valor: body.plano_valor || 0,
        inicio: new Date(body.plano_inicio).toISOString(),
        fim: new Date(body.plano_fim).toISOString(),
        status: "ativo",
      });
    }

    return NextResponse.json({ profissional }, { status: 201 });
  } catch (error) {
    console.error("Error creating profissional:", error);
    return NextResponse.json(
      { error: "Erro ao criar profissional", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Listar leads com filtros
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const stage = searchParams.get("stage") || "all";
    const search = searchParams.get("search") || "";

    // Buscar todos os leads
    let query = supabase
      .from("crm_leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Filtro por stage
    if (stage !== "all") {
      query = query.eq("stage", stage);
    }

    // Pesquisa
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%,interests.ilike.%${search}%`
      );
    }

    const { data: leads, error, count } = await query;

    if (error) throw error;

    // Calcular estatísticas por stage
    const allLeads = leads || [];
    const stats = {
      total: count || 0,
      novo: allLeads.filter((l) => l.stage === "novo").length,
      contactado: allLeads.filter((l) => l.stage === "contactado").length,
      qualificado: allLeads.filter((l) => l.stage === "qualificado").length,
      proposta: allLeads.filter((l) => l.stage === "proposta").length,
      negociacao: allLeads.filter((l) => l.stage === "negociacao").length,
      ganho: allLeads.filter((l) => l.stage === "ganho").length,
      perdido: allLeads.filter((l) => l.stage === "perdido").length,
    };

    // Calcular valor total do pipeline (excluindo ganho/perdido)
    const pipelineValue = allLeads
      .filter((l) => !["ganho", "perdido"].includes(l.stage))
      .reduce((sum, l) => sum + ((l.estimated_value || 0) * (l.probability || 50)) / 100, 0);

    const wonValue = allLeads
      .filter((l) => l.stage === "ganho")
      .reduce((sum, l) => sum + (l.actual_value || l.estimated_value || 0), 0);

    return NextResponse.json({
      leads,
      stats,
      pipelineValue,
      wonValue,
    });
  } catch (error) {
    logger.error("Error fetching CRM leads:", error);
    return NextResponse.json(
      {
        error: "Erro ao carregar leads",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// POST - Criar novo lead
export async function POST(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email: leadEmail,
      telefone,
      company,
      stage = "novo",
      estimated_value = 0,
      probability = 50,
      source_type,
      interests,
      notes,
      budget_min,
      budget_max,
      next_follow_up,
    } = body;

    // Validações
    if (!name || !leadEmail) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 });
    }

    // Criar lead
    const { data: lead, error } = await supabase
      .from("crm_leads")
      .insert({
        name,
        email: leadEmail,
        telefone,
        company,
        stage,
        estimated_value,
        probability,
        source_type,
        interests,
        notes,
        budget_min,
        budget_max,
        next_follow_up: next_follow_up ? new Date(next_follow_up).toISOString() : null,
        owner_email: email,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    logger.error("Error creating lead:", error);
    return NextResponse.json(
      {
        error: "Erro ao criar lead",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

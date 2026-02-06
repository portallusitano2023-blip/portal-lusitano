import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Parâmetros de filtro
    const formType = searchParams.get("form_type"); // 'vender_cavalo', 'publicidade', 'instagram', 'all'
    const status = searchParams.get("status"); // 'novo', 'lido', 'respondido', 'arquivado', 'all'
    const priority = searchParams.get("priority"); // 'baixa', 'normal', 'alta', 'urgente', 'all'
    const search = searchParams.get("search"); // Busca por nome/email/empresa
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Construir query base
    let query = supabase
      .from("contact_submissions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Aplicar filtros
    if (formType && formType !== "all") {
      query = query.eq("form_type", formType);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (priority && priority !== "all") {
      query = query.eq("priority", priority);
    }

    // Busca por texto (nome, email, empresa)
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
    }

    // Paginação
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching messages:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({
      messages: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error("Messages list error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao listar mensagens" },
      { status: 500 }
    );
  }
}

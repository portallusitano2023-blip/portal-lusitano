import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { sanitizeSearchInput } from "@/lib/sanitize";

// GET - Listar coudelarias com filtros
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";
    const distrito = searchParams.get("distrito") || "all";

    // Buscar todas as coudelarias (não-deletadas)
    let query = supabase
      .from("coudelarias")
      .select("*", { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    // Filtros
    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (distrito !== "all") {
      query = query.eq("distrito", distrito);
    }

    // Pesquisa (sanitizada contra PostgREST filter injection)
    if (search) {
      const safeSearch = sanitizeSearchInput(search);
      if (safeSearch) {
        query = query.or(
          `nome.ilike.%${safeSearch}%,cidade.ilike.%${safeSearch}%,distrito.ilike.%${safeSearch}%,proprietario_nome.ilike.%${safeSearch}%`
        );
      }
    }

    const { data: coudelarias, error, count } = await query;

    if (error) throw error;

    // Calcular estatísticas
    const allCoudelarias = coudelarias || [];
    const stats = {
      total: count || 0,
      pendente: allCoudelarias.filter((c) => c.status === "pendente").length,
      aprovado: allCoudelarias.filter((c) => c.status === "aprovado").length,
      rejeitado: allCoudelarias.filter((c) => c.status === "rejeitado").length,
      destaque: allCoudelarias.filter((c) => c.destaque).length,
    };

    return NextResponse.json({
      coudelarias,
      stats,
      count,
    });
  } catch (error) {
    logger.error("Error fetching coudelarias:", error);
    return NextResponse.json(
      {
        error: "Erro ao carregar coudelarias",
      },
      { status: 500 }
    );
  }
}

// POST - Criar nova coudelaria (GRÁTIS)
export async function POST(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      nome,
      descricao,
      historia,
      especialidades,
      morada,
      cidade,
      distrito,
      codigo_postal,
      pais,
      telefone,
      telemovel,
      email: coudelariaEmail,
      website,
      facebook,
      instagram,
      youtube,
      logo_url,
      banner_url,
      galeria,
      ano_fundacao,
      numero_cavalos,
      area_hectares,
      proprietario_nome,
      proprietario_email,
      proprietario_telefone,
      status,
      destaque,
    } = body;

    // Validações
    if (!nome) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    // Criar coudelaria
    const { data: coudelaria, error } = await supabase
      .from("coudelarias")
      .insert({
        nome,
        descricao,
        historia,
        especialidades,
        morada,
        cidade,
        distrito,
        codigo_postal,
        pais: pais || "Portugal",
        telefone,
        telemovel,
        email: coudelariaEmail,
        website,
        facebook,
        instagram,
        youtube,
        logo_url,
        banner_url,
        galeria: galeria || [],
        ano_fundacao,
        numero_cavalos,
        area_hectares,
        proprietario_nome,
        proprietario_email,
        proprietario_telefone,
        status: status || "pendente",
        destaque: destaque || false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ coudelaria }, { status: 201 });
  } catch (error) {
    logger.error("Error creating coudelaria:", error);
    return NextResponse.json(
      {
        error: "Erro ao criar coudelaria",
      },
      { status: 500 }
    );
  }
}

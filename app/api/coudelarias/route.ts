import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Criar slug a partir do nome
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-") // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, ""); // Remove hífens no início e fim
}

// GET - Listar coudelarias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regiao = searchParams.get("regiao");
    const search = searchParams.get("search");
    const onlyPro = searchParams.get("pro") === "true";

    let query = supabase
      .from("coudelarias")
      .select("*")
      .eq("status", "active")
      .order("destaque", { ascending: false })
      .order("ordem_destaque", { ascending: true })
      .order("nome", { ascending: true });

    if (regiao && regiao !== "Todas") {
      query = query.eq("regiao", regiao);
    }

    if (search) {
      query = query.or(`nome.ilike.%${search}%,localizacao.ilike.%${search}%`);
    }

    if (onlyPro) {
      query = query.eq("is_pro", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar coudelarias:", error);
      return NextResponse.json(
        { error: "Erro ao buscar coudelarias" },
        { status: 500 }
      );
    }

    return NextResponse.json({ coudelarias: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Registar nova coudelaria
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nome,
      descricao,
      localizacao,
      regiao,
      telefone,
      email,
      website,
      instagram,
      num_cavalos,
      especialidades,
      plan,
    } = body;

    // Validações básicas
    if (!nome || !descricao || !localizacao || !regiao) {
      return NextResponse.json(
        { error: "Campos obrigatórios em falta" },
        { status: 400 }
      );
    }

    // Criar slug único
    let slug = createSlug(nome);

    // Verificar se slug já existe
    const { data: existingSlug } = await supabase
      .from("coudelarias")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Determinar se é PRO
    const isPro = plan === "pro" || plan === "pro_instagram";
    const hasInstagramPromo = plan === "pro_instagram";

    // Inserir na base de dados
    const { data, error } = await supabase
      .from("coudelarias")
      .insert({
        nome,
        slug,
        descricao,
        localizacao,
        regiao,
        telefone: isPro ? telefone : null,
        email: isPro ? email : null,
        website: isPro ? website : null,
        instagram: isPro ? instagram : null,
        num_cavalos: isPro ? num_cavalos : null,
        especialidades: especialidades || [],
        fotos: [],
        is_pro: isPro,
        has_instagram_promo: hasInstagramPromo,
        plan,
        status: isPro ? "active" : "pending", // Gratuitos ficam pendentes para revisão
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar coudelaria:", error);
      return NextResponse.json(
        { error: "Erro ao registar coudelaria" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      coudelaria: data,
      message: isPro
        ? "Coudelaria registada e ativa!"
        : "Coudelaria submetida para revisão",
    });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

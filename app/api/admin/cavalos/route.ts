import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

// GET - Listar todos os cavalos (admin)
export async function GET() {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("cavalos_venda")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar cavalos:", error);
      return NextResponse.json({ error: "Erro ao buscar cavalos" }, { status: 500 });
    }

    return NextResponse.json({ cavalos: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST - Criar novo anúncio de cavalo
export async function POST(request: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("cavalos_venda")
      .insert({
        nome: body.nome,
        nome_cavalo: body.nome_cavalo,
        descricao: body.descricao,
        preco: body.preco,
        linhagem: body.linhagem,
        idade: body.idade,
        sexo: body.sexo,
        pelagem: body.pelagem,
        altura: body.altura,
        peso: body.peso,
        disciplinas: body.disciplinas,
        nivel: body.nivel,
        localizacao: body.localizacao,
        coudelaria: body.coudelaria,
        imagens: body.imagens,
        image_url: body.image_url,
        slug: body.slug,
        destaque: body.destaque,
        contacto_nome: body.contacto_nome,
        contacto_email: body.contacto_email,
        contacto_telefone: body.contacto_telefone,
        status: "active",
        views_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar anúncio:", error);
      return NextResponse.json({ error: "Erro ao criar anúncio" }, { status: 500 });
    }

    return NextResponse.json({ cavalo: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

// GET - Listar favoritos do utilizador
export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ favoritos: [] });
    }

    const { data, error } = await supabase
      .from("favoritos")
      .select(
        `
        id,
        item_id,
        item_type,
        created_at,
        cavalos_venda (
          id, nome, foto_principal, preco, localizacao, regiao
        ),
        coudelarias (
          id, nome, foto_capa, localizacao, regiao
        )
      `
      )
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar favoritos:", error);
      return NextResponse.json({ favoritos: [] });
    }

    return NextResponse.json({ favoritos: data || [] });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ favoritos: [] });
  }
}

// POST - Adicionar favorito
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Utilizador nao autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { item_id, item_type } = body;

    if (!item_id || !item_type) {
      return NextResponse.json({ error: "item_id e item_type sao obrigatorios" }, { status: 400 });
    }

    // Verificar se ja existe
    const { data: existing } = await supabase
      .from("favoritos")
      .select("id")
      .eq("user_email", userEmail)
      .eq("item_id", item_id)
      .eq("item_type", item_type)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, message: "Ja esta nos favoritos" });
    }

    // Inserir
    const { error } = await supabase.from("favoritos").insert({
      user_email: userEmail,
      item_id,
      item_type,
    });

    if (error) {
      console.error("Erro ao adicionar favorito:", error);
      return NextResponse.json({ error: "Erro ao adicionar favorito" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE - Remover favorito
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Utilizador nao autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const item_id = searchParams.get("item_id");
    const item_type = searchParams.get("item_type");

    if (!item_id || !item_type) {
      return NextResponse.json({ error: "item_id e item_type sao obrigatorios" }, { status: 400 });
    }

    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("user_email", userEmail)
      .eq("item_id", item_id)
      .eq("item_type", item_type);

    if (error) {
      console.error("Erro ao remover favorito:", error);
      return NextResponse.json({ error: "Erro ao remover favorito" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

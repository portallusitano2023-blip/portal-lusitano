import { NextRequest } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { apiSuccess, apiError } from "@/lib/api-response";

async function getAuthUser() {
  const supabaseServer = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  return user;
}

// GET - Listar favoritos do utilizador autenticado
export async function GET(_request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return apiSuccess({ favoritos: [] });
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
          id, slug, nome, foto_principal, preco, localizacao, regiao
        ),
        coudelarias (
          id, nome, foto_capa, localizacao, regiao
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return apiError("Erro ao buscar favoritos", 500, "favoritos/GET");
    }

    return apiSuccess({ favoritos: data || [] });
  } catch {
    return apiError("Erro interno", 500, "favoritos/GET");
  }
}

// POST - Adicionar favorito
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return apiError("Utilizador nao autenticado", 401);
    }

    const body = await request.json();
    const { item_id, item_type } = body;

    if (!item_id || !item_type) {
      return apiError("item_id e item_type sao obrigatorios", 400);
    }

    // Verificar se ja existe
    const { data: existing } = await supabase
      .from("favoritos")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_id", item_id)
      .eq("item_type", item_type)
      .single();

    if (existing) {
      return apiSuccess({ success: true, message: "Ja esta nos favoritos" });
    }

    const { error } = await supabase.from("favoritos").insert({
      user_id: user.id,
      item_id,
      item_type,
    });

    if (error) {
      return apiError("Erro ao adicionar favorito", 500, "favoritos/POST");
    }

    return apiSuccess({ success: true });
  } catch {
    return apiError("Erro interno", 500, "favoritos/POST");
  }
}

// DELETE - Remover favorito
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return apiError("Utilizador nao autenticado", 401);
    }

    const { searchParams } = new URL(request.url);
    const item_id = searchParams.get("item_id");
    const item_type = searchParams.get("item_type");
    const all = searchParams.get("all");

    // Apagar todos os favoritos do utilizador
    if (all === "true") {
      const { error } = await supabase.from("favoritos").delete().eq("user_id", user.id);
      if (error) {
        return apiError("Erro ao limpar favoritos", 500, "favoritos/DELETE");
      }
      return apiSuccess({ success: true });
    }

    if (!item_id || !item_type) {
      return apiError("item_id e item_type sao obrigatorios", 400);
    }

    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("user_id", user.id)
      .eq("item_id", item_id)
      .eq("item_type", item_type);

    if (error) {
      return apiError("Erro ao remover favorito", 500, "favoritos/DELETE");
    }

    return apiSuccess({ success: true });
  } catch {
    return apiError("Erro interno", 500, "favoritos/DELETE");
  }
}

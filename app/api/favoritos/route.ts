import { NextRequest } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

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

    // Query favoritos without embedded selects (no FK relationships in DB)
    const { data: favoritos, error } = await supabase
      .from("favoritos")
      .select("id, item_id, item_type, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("[API favoritos/GET] Supabase error:", error);
      return apiError("Erro ao buscar favoritos", 500, "favoritos/GET");
    }

    if (!favoritos || favoritos.length === 0) {
      return apiSuccess({ favoritos: [] });
    }

    // Separate item IDs by type for parallel fetching
    const cavaloIds = favoritos.filter((f) => f.item_type === "cavalo").map((f) => f.item_id);
    const coudelariaIds = favoritos
      .filter((f) => f.item_type === "coudelaria")
      .map((f) => f.item_id);

    const [cavalosResult, coudelariasResult] = await Promise.all([
      cavaloIds.length > 0
        ? supabase
            .from("cavalos_venda")
            .select("id, slug, nome, foto_principal, preco, localizacao, regiao")
            .in("id", cavaloIds)
        : Promise.resolve({ data: [] as { id: string }[] }),
      coudelariaIds.length > 0
        ? supabase
            .from("coudelarias")
            .select("id, nome, foto_capa, localizacao, regiao")
            .in("id", coudelariaIds)
        : Promise.resolve({ data: [] as { id: string }[] }),
    ]);

    // Create lookup maps
    const cavalosMap = new Map((cavalosResult.data || []).map((c) => [c.id, c]));
    const coudelariasMap = new Map((coudelariasResult.data || []).map((c) => [c.id, c]));

    // Merge favoritos with related data (same shape as the old embedded select)
    const enriched = favoritos.map((f) => ({
      ...f,
      cavalos_venda: f.item_type === "cavalo" ? cavalosMap.get(f.item_id) || null : null,
      coudelarias: f.item_type === "coudelaria" ? coudelariasMap.get(f.item_id) || null : null,
    }));

    return apiSuccess({ favoritos: enriched });
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

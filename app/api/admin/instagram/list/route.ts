import { NextRequest } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { createApiRoute } from "@/lib/createApiRoute";

export const GET = createApiRoute(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "all";

  let query = supabase
    .from("instagram_uploads")
    .select(
      "id, session_id, caption, hashtags, link, observacoes, files_urls, status, customer_email, created_at, published_at"
    )
    .order("created_at", { ascending: false });

  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data, error } = await query;

  if (error) {
    return apiError("Erro ao listar uploads", 500);
  }

  return apiSuccess({ uploads: data || [] });
}, { auth: "admin" });

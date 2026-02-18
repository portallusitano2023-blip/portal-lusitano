import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";

    let query = supabase
      .from("instagram_uploads")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data, error } = await query;

    if (error) {
      logger.error("Supabase error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ uploads: data || [] });
  } catch (error) {
    logger.error("List error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao listar uploads" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

// GET - Listar todas as reviews (admin)
export async function GET(request: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("reviews")
      .select("*, coudelarias(nome, slug)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar reviews:", error);
      return NextResponse.json({ error: "Erro ao buscar reviews" }, { status: 500 });
    }

    return NextResponse.json({ reviews: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

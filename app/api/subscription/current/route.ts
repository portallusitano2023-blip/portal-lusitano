import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Obter email do utilizador a partir do cookie de sessao
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Utilizador nao autenticado" },
        { status: 401 }
      );
    }

    // Buscar subscricao ativa
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("email", userEmail)
      .in("status", ["active", "past_due", "trialing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao buscar subscricao:", error);
      return NextResponse.json(
        { error: "Erro ao buscar dados" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { subscription: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ subscription: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

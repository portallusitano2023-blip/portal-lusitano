import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Listar reviews de uma coudelaria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coudelariaId = searchParams.get("coudelaria_id");

    if (!coudelariaId) {
      return NextResponse.json(
        { error: "ID da coudelaria é obrigatório" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("coudelaria_id", coudelariaId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar reviews:", error);
      return NextResponse.json(
        { error: "Erro ao buscar reviews" },
        { status: 500 }
      );
    }

    // Calcular média
    const total = data?.length || 0;
    const soma = data?.reduce((acc, r) => acc + r.avaliacao, 0) || 0;
    const media = total > 0 ? soma / total : 0;

    return NextResponse.json({
      reviews: data,
      stats: {
        total,
        media: Math.round(media * 10) / 10,
      },
    });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar nova review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      coudelaria_id,
      autor_nome,
      autor_email,
      autor_localizacao,
      avaliacao,
      titulo,
      comentario,
      data_visita,
      tipo_visita,
      recomenda,
    } = body;

    // Validações
    if (!coudelaria_id || !autor_nome || !avaliacao || !comentario) {
      return NextResponse.json(
        { error: "Campos obrigatórios em falta" },
        { status: 400 }
      );
    }

    if (avaliacao < 1 || avaliacao > 5) {
      return NextResponse.json(
        { error: "Avaliação deve ser entre 1 e 5" },
        { status: 400 }
      );
    }

    // Inserir review
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        coudelaria_id,
        autor_nome,
        autor_email,
        autor_localizacao,
        avaliacao,
        titulo,
        comentario,
        data_visita,
        tipo_visita,
        recomenda: recomenda ?? true,
        status: "pending", // Reviews ficam pendentes para moderação
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar review:", error);
      return NextResponse.json(
        { error: "Erro ao submeter avaliação" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review: data,
      message: "Avaliação submetida para aprovação",
    });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

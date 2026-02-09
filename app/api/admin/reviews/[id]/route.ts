import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

// PATCH - Atualizar status de uma review
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reviews")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar review:", error);
      return NextResponse.json({ error: "Erro ao atualizar review" }, { status: 500 });
    }

    // Se aprovada, atualizar média da coudelaria
    if (status === "approved" && data?.coudelaria_id) {
      await updateCoudelariaRating(data.coudelaria_id);
    }

    return NextResponse.json({ review: data });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETE - Eliminar uma review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      console.error("Erro ao eliminar review:", error);
      return NextResponse.json({ error: "Erro ao eliminar review" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// Função auxiliar para atualizar a média de avaliações
async function updateCoudelariaRating(coudelariaId: string) {
  const { data } = await supabase
    .from("reviews")
    .select("avaliacao")
    .eq("coudelaria_id", coudelariaId)
    .eq("status", "approved");

  if (data && data.length > 0) {
    const total = data.length;
    const soma = data.reduce((acc, r) => acc + r.avaliacao, 0);
    const media = Math.round((soma / total) * 10) / 10;

    await supabase
      .from("coudelarias")
      .update({
        media_avaliacoes: media,
        total_avaliacoes: total,
      })
      .eq("id", coudelariaId);
  }
}

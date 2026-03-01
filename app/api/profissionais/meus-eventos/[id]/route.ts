import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedProfissional } from "@/lib/profissional-auth";
import { logger } from "@/lib/logger";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthenticatedProfissional();
    if (!auth) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("profissionais_eventos")
      .delete()
      .eq("id", id)
      .eq("profissional_id", auth.profissional.id);

    if (error) {
      logger.error("Error deleting evento:", error);
      return NextResponse.json({ error: "Erro ao eliminar evento" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Meus eventos DELETE error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

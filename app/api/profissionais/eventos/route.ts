import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabaseAdmin
      .from("profissionais_eventos")
      .select(
        "id, titulo, tipo, descricao, data_inicio, data_fim, local, pais, online, link_inscricao, preco, vagas, created_at, profissional_id, profissionais(nome)"
      )
      .gte("data_inicio", today)
      .order("data_inicio", { ascending: true })
      .limit(50);

    if (error) {
      logger.error("Error fetching eventos:", error);
      return NextResponse.json({ error: "Erro ao carregar eventos" }, { status: 500 });
    }

    const eventos = (data || []).map((e) => ({
      id: e.id,
      titulo: e.titulo,
      tipo: e.tipo,
      data: e.data_inicio,
      dataFim: e.data_fim,
      local: e.local || "",
      pais: e.pais,
      online: e.online,
      organizador: (e.profissionais as unknown as { nome: string })?.nome || "Profissional",
      preco: e.preco,
      vagas: e.vagas,
      descricao: e.descricao,
      linkInscricao: e.link_inscricao,
    }));

    return NextResponse.json(
      { eventos },
      {
        headers: {
          // Public upcoming events listing — cache 10 min at CDN, stale up to 30 min
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    logger.error("Eventos API error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

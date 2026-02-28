import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// Eventos CONFIRMADOS oficialmente para 2026 (com fontes verificadas)
const eventosConfirmados2026 = [
  "iii-salao-cavalo-lusitano-2026", // Confirmado APSL + Equisport
  "feira-cavalo-ponte-lima-2026", // Cartaz apresentado na Golegã 2025
  "galas-epae-2026", // Programa contínuo oficial
];

// Eventos a ELIMINAR (não confirmados oficialmente para 2026)
const eventosParaEliminar2026 = [
  "feira-trofa-2026",
  "aprovacao-eguas-norte-2026",
  "leilao-alter-real-2026",
  "expo-egua-2026",
  "festival-internacional-cavalo-lusitano-2026",
  "campeonato-nacional-equitacao-trabalho-2026",
  "taca-portugal-equitacao-trabalho-2026",
  "cdi-alter-chao-2026",
  "campeonato-cavalos-novos-2026",
  "feira-nacional-cavalo-golega-2026",
  "sicab-2026-sevilha",
  // Duplicados e eventos sem confirmação
  "evento-apsl-shp-2026",
  "campeonato-mundial-equitacao-trabalho-2026",
];

export async function POST() {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const results = {
      confirmados: 0,
      eliminados: 0,
      errors: [] as string[],
    };

    // 1. ELIMINAR eventos 2026 não confirmados
    for (const slug of eventosParaEliminar2026) {
      const { error } = await supabase.from("eventos").delete().eq("slug", slug);

      if (error) {
        results.errors.push(`Erro ao eliminar ${slug}`);
      } else {
        results.eliminados++;
      }
    }

    // 2. Marcar eventos 2026 confirmados
    for (const slug of eventosConfirmados2026) {
      const { error } = await supabase
        .from("eventos")
        .update({ confirmado: "confirmado" })
        .eq("slug", slug);

      if (error) {
        results.errors.push(`Erro em ${slug}`);
      } else {
        results.confirmados++;
      }
    }

    // 3. Marcar todos os eventos de 2025 como confirmados (já passaram)
    const { error: error2025 } = await supabase
      .from("eventos")
      .update({ confirmado: "confirmado" })
      .like("slug", "%-2025");

    if (error2025) {
      results.errors.push(`Erro eventos 2025: ${error2025.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Eventos atualizados - apenas confirmados mantidos",
      results,
    });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// GET - Ver status atual
export async function GET() {
  const email = await verifySession();
  if (!email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("eventos")
    .select("titulo, slug, data_inicio, confirmado")
    .order("data_inicio", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Erro ao buscar eventos" }, { status: 500 });
  }

  return NextResponse.json({
    total: data?.length || 0,
    eventos: data,
  });
}

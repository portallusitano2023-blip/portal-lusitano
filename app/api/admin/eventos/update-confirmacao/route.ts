import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Eventos CONFIRMADOS oficialmente para 2026
const eventosConfirmados2026 = [
  "iii-salao-cavalo-lusitano-2026",           // Equisport confirmou
  "feira-cavalo-ponte-lima-2026",              // Anunciado na Golegã 2025
  "feira-nacional-cavalo-golega-2026",         // Tradição centenária - São Martinho
  "galas-epae-2026",                           // Programa contínuo confirmado
];

// Eventos ANUAIS (acontecem sempre, datas baseadas em padrão histórico)
const eventosAnuais2026 = [
  "feira-trofa-2026",                          // Sempre final Fev/início Mar
  "leilao-alter-real-2026",                    // Sempre 24 Abril
  "expo-egua-2026",                            // Sempre Maio
  "festival-internacional-cavalo-lusitano-2026", // Sempre final Junho
  "sicab-2026-sevilha",                        // Sempre 3ª semana Novembro
];

// Eventos PROVISÓRIOS (datas estimadas, aguardam confirmação oficial)
const eventosProvisórios2026 = [
  "aprovacao-eguas-norte-2026",
  "campeonato-nacional-equitacao-trabalho-2026",
  "taca-portugal-equitacao-trabalho-2026",
  "cdi-alter-chao-2026",
  "campeonato-cavalos-novos-2026",
];

export async function POST() {
  try {
    const results = {
      confirmados: 0,
      anuais: 0,
      provisorios: 0,
      errors: [] as string[],
    };

    // Marcar eventos confirmados
    for (const slug of eventosConfirmados2026) {
      const { error } = await supabase
        .from("eventos")
        .update({ confirmado: "confirmado" })
        .eq("slug", slug);

      if (error) {
        results.errors.push(`Erro em ${slug}: ${error.message}`);
      } else {
        results.confirmados++;
      }
    }

    // Marcar eventos anuais
    for (const slug of eventosAnuais2026) {
      const { error } = await supabase
        .from("eventos")
        .update({ confirmado: "anual" })
        .eq("slug", slug);

      if (error) {
        results.errors.push(`Erro em ${slug}: ${error.message}`);
      } else {
        results.anuais++;
      }
    }

    // Marcar eventos provisórios
    for (const slug of eventosProvisórios2026) {
      const { error } = await supabase
        .from("eventos")
        .update({ confirmado: "provisorio" })
        .eq("slug", slug);

      if (error) {
        results.errors.push(`Erro em ${slug}: ${error.message}`);
      } else {
        results.provisorios++;
      }
    }

    // Marcar todos os eventos de 2025 como confirmados (já passaram ou estão a decorrer)
    const { error: error2025 } = await supabase
      .from("eventos")
      .update({ confirmado: "confirmado" })
      .like("slug", "%-2025");

    if (error2025) {
      results.errors.push(`Erro eventos 2025: ${error2025.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Status de confirmação atualizado",
      results,
    });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Ver status atual
export async function GET() {
  const { data, error } = await supabase
    .from("eventos")
    .select("titulo, slug, data_inicio, confirmado")
    .order("data_inicio", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    total: data?.length || 0,
    eventos: data,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Estatísticas por status
    const { data: statusStats } = await supabase
      .from("contact_submissions")
      .select("status")
      .then((result) => {
        const stats = {
          novo: 0,
          lido: 0,
          em_progresso: 0,
          respondido: 0,
          arquivado: 0,
        };

        result.data?.forEach((item) => {
          if (stats.hasOwnProperty(item.status)) {
            stats[item.status as keyof typeof stats]++;
          }
        });

        return { data: stats };
      });

    // Estatísticas por tipo de formulário
    const { data: formTypeStats } = await supabase
      .from("contact_submissions")
      .select("form_type")
      .then((result) => {
        const stats: Record<string, number> = {
          vender_cavalo: 0,
          publicidade: 0,
          instagram: 0,
          contact_general: 0,
        };

        result.data?.forEach((item) => {
          if (stats.hasOwnProperty(item.form_type)) {
            stats[item.form_type]++;
          }
        });

        return { data: stats };
      });

    // Estatísticas por prioridade
    const { data: priorityStats } = await supabase
      .from("contact_submissions")
      .select("priority")
      .then((result) => {
        const stats = {
          baixa: 0,
          normal: 0,
          alta: 0,
          urgente: 0,
        };

        result.data?.forEach((item) => {
          if (stats.hasOwnProperty(item.priority)) {
            stats[item.priority as keyof typeof stats]++;
          }
        });

        return { data: stats };
      });

    // Total de mensagens
    const { count: totalMessages } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true });

    // Mensagens não lidas (novo)
    const { count: unreadMessages } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "novo");

    // Mensagens das últimas 24h
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: last24h } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterday);

    // Mensagens da última semana
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: lastWeekCount } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastWeek);

    // Taxa de resposta (respondidas / total não-arquivadas)
    const { count: responded } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "respondido");

    const { count: nonArchived } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .neq("status", "arquivado");

    const responseRate = nonArchived && nonArchived > 0
      ? ((responded || 0) / nonArchived) * 100
      : 0;

    // Última mensagem nova (para push notifications)
    const { data: latestMessage } = await supabase
      .from("contact_submissions")
      .select("id, name, email, form_type, created_at")
      .eq("status", "novo")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      total: totalMessages || 0,
      unread: unreadMessages || 0,
      last24h: last24h || 0,
      lastWeek: lastWeekCount || 0,
      responseRate: Math.round(responseRate * 10) / 10, // 1 casa decimal
      stats: statusStats, // Mudado de byStatus para stats para compatibilidade
      byStatus: statusStats,
      byFormType: formTypeStats,
      byPriority: priorityStats,
      latestMessage: latestMessage || null,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}

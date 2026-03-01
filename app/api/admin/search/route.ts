import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { sanitizeSearchInput } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        results: [],
        total: 0,
      });
    }

    const searchTerm = sanitizeSearchInput(query.trim().toLowerCase());

    // Pesquisar em paralelo em todas as tabelas
    const [cavalosRes, eventosRes, mensagensRes, coudelariasRes, profissionaisRes, reviewsRes] =
      await Promise.all([
        // Cavalos
        supabase
          .from("cavalos_venda")
          .select("id, nome, preco, status, created_at")
          .or(`nome.ilike.%${searchTerm}%,descricao.ilike.%${searchTerm}%`)
          .limit(limit),

        // Eventos
        supabase
          .from("eventos")
          .select("id, nome, data_inicio, tipo, created_at")
          .or(`nome.ilike.%${searchTerm}%,descricao.ilike.%${searchTerm}%`)
          .limit(limit),

        // Mensagens
        supabase
          .from("contact_submissions")
          .select("id, name, email, form_type, status, created_at")
          .or(
            `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`
          )
          .limit(limit),

        // Coudelarias
        supabase
          .from("coudelarias")
          .select("id, nome, localizacao, plano, created_at")
          .or(
            `nome.ilike.%${searchTerm}%,descricao.ilike.%${searchTerm}%,localizacao.ilike.%${searchTerm}%`
          )
          .limit(limit),

        // Profissionais
        supabase
          .from("profissionais")
          .select("id, nome, categoria, localizacao, status, created_at")
          .or(`nome.ilike.%${searchTerm}%,especialidade.ilike.%${searchTerm}%`)
          .limit(limit),

        // Reviews
        supabase
          .from("reviews_cavalos")
          .select("id, nome_avaliador, comentario, rating, created_at")
          .or(`nome_avaliador.ilike.%${searchTerm}%,comentario.ilike.%${searchTerm}%`)
          .limit(limit),
      ]);

    // Formatar resultados
    const results = [];

    // Cavalos
    if (cavalosRes.data && cavalosRes.data.length > 0) {
      results.push({
        category: "Cavalos",
        icon: "🐴",
        items: cavalosRes.data.map((item) => ({
          id: item.id,
          title: item.nome,
          subtitle: `€${item.preco} • ${item.status}`,
          type: "cavalo",
          link: `/admin-app?tab=cavalos&id=${item.id}`,
          timestamp: item.created_at,
        })),
      });
    }

    // Eventos
    if (eventosRes.data && eventosRes.data.length > 0) {
      results.push({
        category: "Eventos",
        icon: "📅",
        items: eventosRes.data.map((item) => ({
          id: item.id,
          title: item.nome,
          subtitle: `${new Date(item.data_inicio).toLocaleDateString("pt-PT")} • ${item.tipo}`,
          type: "evento",
          link: `/admin-app?tab=eventos&id=${item.id}`,
          timestamp: item.created_at,
        })),
      });
    }

    // Mensagens
    if (mensagensRes.data && mensagensRes.data.length > 0) {
      results.push({
        category: "Mensagens",
        icon: "📧",
        items: mensagensRes.data.map((item) => ({
          id: item.id,
          title: item.name,
          subtitle: `${item.email} • ${item.form_type} • ${item.status}`,
          type: "mensagem",
          link: `/admin-app?tab=mensagens&id=${item.id}`,
          timestamp: item.created_at,
        })),
      });
    }

    // Coudelarias
    if (coudelariasRes.data && coudelariasRes.data.length > 0) {
      results.push({
        category: "Coudelarias",
        icon: "🏛️",
        items: coudelariasRes.data.map((item) => ({
          id: item.id,
          title: item.nome,
          subtitle: `${item.localizacao} • Plano ${item.plano}`,
          type: "coudelaria",
          link: `/admin-app?tab=coudelarias&id=${item.id}`,
          timestamp: item.created_at,
        })),
      });
    }

    // Profissionais
    if (profissionaisRes.data && profissionaisRes.data.length > 0) {
      results.push({
        category: "Profissionais",
        icon: "👔",
        items: profissionaisRes.data.map((item) => ({
          id: item.id,
          title: item.nome,
          subtitle: `${item.categoria} • ${item.localizacao} • ${item.status}`,
          type: "profissional",
          link: `/admin-app?tab=profissionais&id=${item.id}`,
          timestamp: item.created_at,
        })),
      });
    }

    // Reviews
    if (reviewsRes.data && reviewsRes.data.length > 0) {
      results.push({
        category: "Reviews",
        icon: "⭐",
        items: reviewsRes.data.map((item) => ({
          id: item.id,
          title: item.nome_avaliador,
          subtitle: `${item.rating}/5 estrelas`,
          type: "review",
          link: `/admin-app?tab=reviews&id=${item.id}`,
          timestamp: item.created_at,
        })),
      });
    }

    // Calcular total de resultados
    const total = results.reduce((acc, cat) => acc + cat.items.length, 0);

    return NextResponse.json({
      results,
      total,
      query: searchTerm,
    });
  } catch (error) {
    logger.error("Search error:", error);
    return NextResponse.json({ error: "Erro ao pesquisar" }, { status: 500 });
  }
}

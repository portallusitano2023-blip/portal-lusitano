import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthISO = startOfMonth.toISOString();

    // Buscar todas as subscrições
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("*");

    if (subError) {
      console.error("Erro ao buscar subscriptions:", subError);
    }

    // Buscar leads (ebooks)
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select("*");

    if (leadsError) {
      console.error("Erro ao buscar leads:", leadsError);
    }

    // Buscar consultorias pendentes
    const { data: consultations, error: consultError } = await supabase
      .from("consultation_tickets")
      .select("*")
      .in("status", ["pending", "in_progress"]);

    if (consultError) {
      console.error("Erro ao buscar consultorias:", consultError);
    }

    // Buscar cavalos
    const { data: cavalos, error: cavalosError } = await supabase
      .from("cavalos_venda")
      .select("id, status, views_count, created_at");

    if (cavalosError) {
      console.error("Erro ao buscar cavalos:", cavalosError);
    }

    // Buscar eventos
    const { data: eventos, error: eventosError } = await supabase
      .from("eventos")
      .select("id, destaque, data, views_count");

    if (eventosError) {
      console.error("Erro ao buscar eventos:", eventosError);
    }

    // Buscar coudelarias
    const { data: coudelarias, error: coudError } = await supabase
      .from("coudelarias")
      .select("id, is_pro, destaque");

    if (coudError) {
      console.error("Erro ao buscar coudelarias:", coudError);
    }

    // Buscar reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("id, status, created_at");

    if (reviewsError) {
      console.error("Erro ao buscar reviews:", reviewsError);
    }

    // Calcular estatísticas de subscrições
    const activeSubscriptions = subscriptions?.filter(s => s.status === "active") || [];
    const cancelledThisMonth = subscriptions?.filter(s =>
      s.cancelled_at && new Date(s.cancelled_at) >= startOfMonth
    ).length || 0;
    const newThisMonth = subscriptions?.filter(s =>
      s.created_at && new Date(s.created_at) >= startOfMonth && s.status === "active"
    ).length || 0;

    // Contar por plano
    const aficionadoMembers = activeSubscriptions.filter(s =>
      s.plan_name?.toLowerCase().includes("aficionado") || s.amount <= 1500
    ).length;
    const criadorMembers = activeSubscriptions.filter(s =>
      s.plan_name?.toLowerCase().includes("criador") || (s.amount > 1500 && s.amount <= 6000)
    ).length;
    const eliteMembers = activeSubscriptions.filter(s =>
      s.plan_name?.toLowerCase().includes("elite") || s.amount > 6000
    ).length;

    // Calcular receita mensal (em cêntimos para EUR)
    const monthlyRevenue = activeSubscriptions.reduce((sum, s) => {
      if (s.billing_period === "yearly") {
        return sum + (s.amount || 0) / 12;
      }
      return sum + (s.amount || 0);
    }, 0) / 100; // Converter de cêntimos para EUR

    // Calcular churn rate
    const totalMembers = activeSubscriptions.length;
    const churnRate = totalMembers > 0
      ? ((cancelledThisMonth / totalMembers) * 100).toFixed(1)
      : 0;

    // Stats de leads/ebooks
    const totalLeads = leads?.length || 0;
    const convertedLeads = leads?.filter(l => l.converted_to_pro).length || 0;

    // Stats de cavalos
    const totalCavalos = cavalos?.length || 0;
    const activeCavalos = cavalos?.filter(c => c.status === "active").length || 0;
    const soldCavalos = cavalos?.filter(c => c.status === "sold").length || 0;
    const cavalosViews = cavalos?.reduce((sum, c) => sum + (c.views_count || 0), 0) || 0;

    // Stats de eventos
    const totalEventos = eventos?.length || 0;
    const featuredEventos = eventos?.filter(e => e.destaque).length || 0;
    const futureEventos = eventos?.filter(e => new Date(e.data) > now).length || 0;
    const eventosViews = eventos?.reduce((sum, e) => sum + (e.views_count || 0), 0) || 0;

    // Stats de coudelarias
    const totalCoudelarias = coudelarias?.length || 0;
    const proCoudelarias = coudelarias?.filter(c => c.is_pro).length || 0;
    const featuredCoudelarias = coudelarias?.filter(c => c.destaque).length || 0;

    // Stats de reviews
    const totalReviews = reviews?.length || 0;
    const pendingReviews = reviews?.filter(r => r.status === "pending").length || 0;
    const approvedReviews = reviews?.filter(r => r.status === "approved").length || 0;

    const stats = {
      // Membros PRO
      totalMembers,
      aficionadoMembers,
      criadorMembers,
      eliteMembers,
      newMembersThisMonth: newThisMonth,
      cancelledThisMonth,
      churnRate: parseFloat(churnRate as string) || 0,

      // Receitas
      monthlyRevenue,
      yearlyRevenue: monthlyRevenue * 12,

      // Consultorias
      pendingConsultations: consultations?.length || 0,

      // Leads/Ebooks
      totalLeads,
      convertedLeads,
      conversionRate: totalLeads > 0
        ? ((convertedLeads / totalLeads) * 100).toFixed(1)
        : 0,

      // Cavalos
      totalCavalos,
      activeCavalos,
      soldCavalos,
      cavalosViews,

      // Eventos
      totalEventos,
      featuredEventos,
      futureEventos,
      eventosViews,

      // Coudelarias
      totalCoudelarias,
      proCoudelarias,
      featuredCoudelarias,

      // Reviews
      totalReviews,
      pendingReviews,
      approvedReviews,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}

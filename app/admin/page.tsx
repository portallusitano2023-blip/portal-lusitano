"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AdminLogoutButton from "@/components/AdminLogoutButton";

interface DashboardStats {
  totalMembers: number;
  aficionadoMembers: number;
  criadorMembers: number;
  eliteMembers: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  pendingConsultations: number;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  churnRate: number;
  newMembersThisMonth: number;
  cancelledThisMonth: number;
  totalCavalos: number;
  activeCavalos: number;
  soldCavalos: number;
  cavalosViews: number;
  totalEventos: number;
  featuredEventos: number;
  futureEventos: number;
  eventosViews: number;
  totalCoudelarias: number;
  proCoudelarias: number;
  featuredCoudelarias: number;
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) {
        throw new Error("Erro ao carregar estatísticas");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Erro:", err);
      setError("Erro ao carregar dados. Verifique a conexão com Supabase.");
      // Fallback para dados de demonstração
      setStats({
        totalMembers: 0,
        aficionadoMembers: 0,
        criadorMembers: 0,
        eliteMembers: 0,
        monthlyRevenue: 0,
        yearlyRevenue: 0,
        pendingConsultations: 0,
        totalLeads: 0,
        convertedLeads: 0,
        conversionRate: 0,
        churnRate: 0,
        newMembersThisMonth: 0,
        cancelledThisMonth: 0,
        totalCavalos: 0,
        activeCavalos: 0,
        soldCavalos: 0,
        cavalosViews: 0,
        totalEventos: 0,
        featuredEventos: 0,
        futureEventos: 0,
        eventosViews: 0,
        totalCoudelarias: 0,
        proCoudelarias: 0,
        featuredCoudelarias: 0,
        totalReviews: 0,
        pendingReviews: 0,
        approvedReviews: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-PT").format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600 mt-1">
                Portal Lusitano - Visão Geral
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <Link
                href="/admin/consultoria"
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
              >
                Consultorias
              </Link>
              <Link
                href="/"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Ver Site
              </Link>
              <AdminLogoutButton className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Stats Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Coudelarias */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
          >
            <p className="text-sm opacity-90">Coudelarias</p>
            <p className="text-4xl font-bold mt-2">{stats.totalCoudelarias}</p>
            <p className="text-sm mt-2">
              {stats.proCoudelarias} PRO | {stats.featuredCoudelarias} destaque
            </p>
          </motion.div>

          {/* Cavalos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg p-6 text-white"
          >
            <p className="text-sm opacity-90">Cavalos no Marketplace</p>
            <p className="text-4xl font-bold mt-2">{stats.totalCavalos}</p>
            <p className="text-sm mt-2">
              {stats.activeCavalos} ativos | {stats.soldCavalos} vendidos
            </p>
          </motion.div>

          {/* Eventos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
          >
            <p className="text-sm opacity-90">Eventos</p>
            <p className="text-4xl font-bold mt-2">{stats.totalEventos}</p>
            <p className="text-sm mt-2">
              {stats.futureEventos} futuros | {stats.featuredEventos} destaque
            </p>
          </motion.div>

          {/* Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white"
          >
            <p className="text-sm opacity-90">Leads (Ebook Grátis)</p>
            <p className="text-4xl font-bold mt-2">{stats.totalLeads}</p>
            <p className="text-sm mt-2">
              {stats.convertedLeads} convertidos ({stats.conversionRate}%)
            </p>
          </motion.div>
        </div>

        {/* Segunda linha de stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Membros PRO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Membros PRO</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.totalMembers}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Aficionado</span>
                <span className="font-semibold">{stats.aficionadoMembers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Criador</span>
                <span className="font-semibold">{stats.criadorMembers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Elite</span>
                <span className="font-semibold">{stats.eliteMembers}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">+{stats.newMembersThisMonth} novos</span>
                <span className="text-red-600">-{stats.cancelledThisMonth} cancelados</span>
              </div>
            </div>
          </motion.div>

          {/* Receita */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Receita PRO</h3>
            <p className="text-4xl font-bold text-green-600">
              {formatCurrency(stats.monthlyRevenue)}
            </p>
            <p className="text-sm text-gray-500 mt-1">MRR (Mensal Recorrente)</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ARR (Anual)</span>
                <span className="font-semibold">{formatCurrency(stats.yearlyRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Churn Rate</span>
                <span className={`font-semibold ${stats.churnRate < 5 ? "text-green-600" : "text-red-600"}`}>
                  {stats.churnRate}%
                </span>
              </div>
              {stats.totalMembers > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">LTV Médio</span>
                  <span className="font-semibold">
                    {formatCurrency((stats.monthlyRevenue / stats.totalMembers) * 12)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Reviews & Consultorias */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Atividade</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Consultorias Pendentes</span>
                  <span className={`text-2xl font-bold ${stats.pendingConsultations > 0 ? "text-amber-600" : "text-green-600"}`}>
                    {stats.pendingConsultations}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reviews Pendentes</span>
                  <span className={`text-2xl font-bold ${stats.pendingReviews > 0 ? "text-amber-600" : "text-green-600"}`}>
                    {stats.pendingReviews}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reviews Aprovados</span>
                  <span className="font-semibold">{stats.approvedReviews}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-semibold">{stats.totalReviews}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Views Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Visualizações
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-3xl font-bold text-amber-600">{formatNumber(stats.cavalosViews)}</p>
              <p className="text-gray-600 mt-1">Views Cavalos</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{formatNumber(stats.eventosViews)}</p>
              <p className="text-gray-600 mt-1">Views Eventos</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {formatNumber(stats.cavalosViews + stats.eventosViews)}
              </p>
              <p className="text-gray-600 mt-1">Total Views</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Acoes Rapidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/consultoria"
              className="bg-amber-100 hover:bg-amber-200 rounded-lg p-4 text-center transition"
            >
              <p className="text-3xl mb-2">📧</p>
              <p className="font-semibold text-gray-900">Consultorias</p>
              <p className="text-sm text-gray-600">{stats.pendingConsultations} pendentes</p>
            </Link>

            <Link
              href="/admin/subscriptions"
              className="bg-blue-100 hover:bg-blue-200 rounded-lg p-4 text-center transition"
            >
              <p className="text-3xl mb-2">👥</p>
              <p className="font-semibold text-gray-900">Subscricoes</p>
              <p className="text-sm text-gray-600">{stats.totalMembers} ativos</p>
            </Link>

            <Link
              href="/admin/reviews"
              className="bg-yellow-100 hover:bg-yellow-200 rounded-lg p-4 text-center transition"
            >
              <p className="text-3xl mb-2">⭐</p>
              <p className="font-semibold text-gray-900">Reviews</p>
              <p className="text-sm text-gray-600">{stats.pendingReviews} pendentes</p>
            </Link>

            <Link
              href="/admin/analytics"
              className="bg-green-100 hover:bg-green-200 rounded-lg p-4 text-center transition"
            >
              <p className="text-3xl mb-2">📊</p>
              <p className="font-semibold text-gray-900">Analytics</p>
              <p className="text-sm text-gray-600">Ver relatorios</p>
            </Link>
          </div>
        </div>

        {/* Content Management */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Gestao de Conteudo
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/cavalos"
              className="bg-orange-100 hover:bg-orange-200 rounded-lg p-4 text-center transition"
            >
              <p className="text-3xl mb-2">🐴</p>
              <p className="font-semibold text-gray-900">Marketplace</p>
              <p className="text-sm text-gray-600">{stats.totalCavalos} cavalos</p>
            </Link>

            <Link
              href="/admin/eventos"
              className="bg-pink-100 hover:bg-pink-200 rounded-lg p-4 text-center transition"
            >
              <p className="text-3xl mb-2">📅</p>
              <p className="font-semibold text-gray-900">Eventos</p>
              <p className="text-sm text-gray-600">{stats.totalEventos} eventos</p>
            </Link>

            <Link
              href="/directorio"
              className="bg-teal-100 hover:bg-teal-200 rounded-lg p-4 text-center transition"
            >
              <p className="text-3xl mb-2">🏠</p>
              <p className="font-semibold text-gray-900">Coudelarias</p>
              <p className="text-sm text-gray-600">{stats.totalCoudelarias} registadas</p>
            </Link>

            <Link
              href="/linhagens"
              className="bg-indigo-100 hover:bg-indigo-200 rounded-lg p-4 text-center transition"
            >
              <p className="text-3xl mb-2">🧬</p>
              <p className="font-semibold text-gray-900">Linhagens</p>
              <p className="text-sm text-gray-600">Genealogia</p>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Status do Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-gray-900">Supabase</p>
                <p className="text-sm text-gray-500">Operacional</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-gray-900">Stripe</p>
                <p className="text-sm text-gray-500">Operacional</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-gray-900">Resend</p>
                <p className="text-sm text-gray-500">Operacional</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-gray-900">Shopify</p>
                <p className="text-sm text-gray-500">Operacional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

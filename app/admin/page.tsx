"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface DashboardStats {
  totalMembers: number;
  aficionadoMembers: number;
  criadorMembers: number;
  eliteMembers: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  pendingConsultations: number;
  totalEbooks: number;
  totalDownloads: number;
  churnRate: number;
  newMembersThisMonth: number;
  cancelledThisMonth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    aficionadoMembers: 0,
    criadorMembers: 0,
    eliteMembers: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    pendingConsultations: 0,
    totalEbooks: 0,
    totalDownloads: 0,
    churnRate: 0,
    newMembersThisMonth: 0,
    cancelledThisMonth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // TODO: Fetch real data from Supabase
    // Simular dados para demonstração
    setTimeout(() => {
      setStats({
        totalMembers: 142,
        aficionadoMembers: 87,
        criadorMembers: 42,
        eliteMembers: 13,
        monthlyRevenue: 4725.86,
        yearlyRevenue: 56710.32,
        pendingConsultations: 7,
        totalEbooks: 28,
        totalDownloads: 1847,
        churnRate: 3.2,
        newMembersThisMonth: 23,
        cancelledThisMonth: 5,
      });
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🎛️ Dashboard Administrativo
              </h1>
              <p className="text-gray-600 mt-1">
                Portal Lusitano PRO - Visão Geral
              </p>
            </div>
            <div className="flex gap-4">
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
          >
            <p className="text-sm opacity-90">Total de Membros</p>
            <p className="text-4xl font-bold mt-2">{stats.totalMembers}</p>
            <p className="text-sm mt-2">
              +{stats.newMembersThisMonth} este mês
            </p>
          </motion.div>

          {/* Monthly Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white"
          >
            <p className="text-sm opacity-90">Receita Mensal</p>
            <p className="text-4xl font-bold mt-2">
              {formatCurrency(stats.monthlyRevenue)}
            </p>
            <p className="text-sm mt-2">MRR (Receita Recorrente)</p>
          </motion.div>

          {/* Pending Consultations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg p-6 text-white"
          >
            <p className="text-sm opacity-90">Consultorias Pendentes</p>
            <p className="text-4xl font-bold mt-2">
              {stats.pendingConsultations}
            </p>
            <p className="text-sm mt-2">Necessitam resposta</p>
          </motion.div>

          {/* Total Ebooks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
          >
            <p className="text-sm opacity-90">Biblioteca de Ebooks</p>
            <p className="text-4xl font-bold mt-2">{stats.totalEbooks}</p>
            <p className="text-sm mt-2">{stats.totalDownloads} downloads</p>
          </motion.div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Members by Plan */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📊 Membros por Plano
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Aficionado (€9.99/mês)</span>
                  <span className="font-bold text-gray-900">
                    {stats.aficionadoMembers}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{
                      width: `${(stats.aficionadoMembers / stats.totalMembers) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(stats.aficionadoMembers * 9.99)}/mês
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Criador (€49.99/mês)</span>
                  <span className="font-bold text-gray-900">
                    {stats.criadorMembers}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-amber-500 h-3 rounded-full"
                    style={{
                      width: `${(stats.criadorMembers / stats.totalMembers) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(stats.criadorMembers * 49.99)}/mês
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Elite (€199/mês)</span>
                  <span className="font-bold text-gray-900">
                    {stats.eliteMembers}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-500 h-3 rounded-full"
                    style={{
                      width: `${(stats.eliteMembers / stats.totalMembers) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(stats.eliteMembers * 199)}/mês
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">
                  Receita Mensal Total:
                </span>
                <span className="font-bold text-green-600 text-xl">
                  {formatCurrency(stats.monthlyRevenue)}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📈 Métricas de Performance
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">Receita Anual</p>
                  <p className="text-sm text-gray-500">ARR projetada</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.yearlyRevenue)}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">Taxa de Cancelamento</p>
                  <p className="text-sm text-gray-500">Churn rate mensal</p>
                </div>
                <p
                  className={`text-2xl font-bold ${stats.churnRate < 5 ? "text-green-600" : "text-red-600"}`}
                >
                  {stats.churnRate}%
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">Novos Membros</p>
                  <p className="text-sm text-gray-500">Este mês</p>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  +{stats.newMembersThisMonth}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">Cancelamentos</p>
                  <p className="text-sm text-gray-500">Este mês</p>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  -{stats.cancelledThisMonth}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">LTV (Lifetime Value)</p>
                  <p className="text-sm text-gray-500">Valor médio por membro</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.monthlyRevenue / stats.totalMembers * 12)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ⚡ Ações Rápidas
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
              <p className="font-semibold text-gray-900">Subscrições</p>
              <p className="text-sm text-gray-600">{stats.totalMembers} ativos</p>
            </Link>

            <Link
              href="/admin/content"
              className="bg-purple-100 hover:bg-purple-200 rounded-lg p-4 text-center transition"
            >
              <p className="text-3xl mb-2">📚</p>
              <p className="font-semibold text-gray-900">Conteúdo</p>
              <p className="text-sm text-gray-600">{stats.totalEbooks} ebooks</p>
            </Link>

            <Link
              href="/admin/analytics"
              className="bg-green-100 hover:bg-green-200 rounded-lg p-4 text-center transition"
            >
              <p className="text-3xl mb-2">📊</p>
              <p className="font-semibold text-gray-900">Analytics</p>
              <p className="text-sm text-gray-600">Ver relatórios</p>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🔧 Status do Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="font-semibold text-gray-900">Resend (Emails)</p>
                <p className="text-sm text-gray-500">Operacional</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-gray-900">Supabase</p>
                <p className="text-sm text-gray-500">Configurar</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Próximos Passos:</strong> Conectar Supabase para ativar
              autenticação e base de dados. Ver{" "}
              <code className="bg-blue-100 px-2 py-1 rounded">
                supabase/schema.sql
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

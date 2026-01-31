"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Download,
  Crown,
  Mail,
  Eye,
  MousePointer,
  ArrowRight,
  Calendar,
  Filter,
  RefreshCw,
  BookOpen,
  DollarSign,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";

/**
 * ANALYTICS DASHBOARD
 *
 * Dashboard para visualizar métricas do Portal Lusitano:
 * - Downloads do ebook gratuito
 * - Conversões para PRO
 * - Funil de vendas
 * - Email performance
 *
 * NOTA: Isto é um mockup/template. Em produção, integrar com:
 * - Supabase (para dados reais)
 * - Google Analytics Data API
 * - Stripe para dados de revenue
 */

// Dados mockados para demonstração
const mockData = {
  period: "Últimos 30 dias",
  summary: {
    totalVisitors: 12453,
    ebookDownloads: 847,
    proSubscriptions: 23,
    totalRevenue: 1149.77,
    conversionRate: 2.72,
  },
  trends: {
    visitors: 15.3,
    downloads: 22.7,
    subscriptions: 8.5,
    revenue: 12.4,
  },
  funnel: {
    ebookLanding: 3245,
    formStarted: 1523,
    formSubmitted: 847,
    pdfDownloaded: 792,
  },
  proFunnel: {
    proPageView: 1234,
    planSelected: 456,
    checkoutStarted: 187,
    paymentCompleted: 23,
  },
  emailStats: {
    totalSent: 847,
    opened: 423,
    clicked: 156,
    openRate: 49.9,
    clickRate: 18.4,
  },
  topSources: [
    { source: "Google Organic", visitors: 4521, percentage: 36.3 },
    { source: "Instagram", visitors: 2890, percentage: 23.2 },
    { source: "Facebook Ads", visitors: 2156, percentage: 17.3 },
    { source: "Direct", visitors: 1567, percentage: 12.6 },
    { source: "Email", visitors: 1319, percentage: 10.6 },
  ],
  recentConversions: [
    { date: "2024-01-30", type: "PRO Criador", value: 49.99, email: "j***@gmail.com" },
    { date: "2024-01-30", type: "PRO Aficionado", value: 9.99, email: "m***@hotmail.com" },
    { date: "2024-01-29", type: "PRO Criador", value: 49.99, email: "p***@sapo.pt" },
    { date: "2024-01-29", type: "PRO Elite", value: 199.00, email: "c***@empresa.pt" },
    { date: "2024-01-28", type: "PRO Criador", value: 49.99, email: "a***@gmail.com" },
  ],
};

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("30d");

  const stats = [
    {
      title: "Visitantes",
      value: mockData.summary.totalVisitors.toLocaleString(),
      change: mockData.trends.visitors,
      icon: Users,
      color: "blue",
    },
    {
      title: "Ebook Downloads",
      value: mockData.summary.ebookDownloads.toLocaleString(),
      change: mockData.trends.downloads,
      icon: Download,
      color: "green",
    },
    {
      title: "Subscrições PRO",
      value: mockData.summary.proSubscriptions.toString(),
      change: mockData.trends.subscriptions,
      icon: Crown,
      color: "gold",
    },
    {
      title: "Revenue",
      value: `€${mockData.summary.totalRevenue.toLocaleString()}`,
      change: mockData.trends.revenue,
      icon: DollarSign,
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
      green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
      gold: { bg: "bg-[#C5A059]/10", text: "text-[#C5A059]", border: "border-[#C5A059]/30" },
      purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-4xl font-serif text-white mb-2">Analytics Dashboard</h1>
            <p className="text-zinc-400">Métricas do Portal Lusitano PRO</p>
          </div>

          <div className="flex items-center gap-4 mt-6 md:mt-0">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-lg p-1">
              {["7d", "30d", "90d", "1y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    dateRange === range
                      ? "bg-[#C5A059] text-black font-medium"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {range === "7d" && "7 Dias"}
                  {range === "30d" && "30 Dias"}
                  {range === "90d" && "90 Dias"}
                  {range === "1y" && "1 Ano"}
                </button>
              ))}
            </div>

            <button className="p-3 bg-zinc-900 border border-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const colors = getColorClasses(stat.color);
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-zinc-900/50 border ${colors.border} p-6 rounded-xl`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colors.bg}`}>
                    <stat.icon className={colors.text} size={24} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.change >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {stat.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(stat.change)}%
                  </div>
                </div>
                <h3 className="text-zinc-400 text-sm mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Funnels */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Ebook Funnel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <BookOpen className="text-green-400" size={20} />
              </div>
              <h2 className="text-xl font-serif text-white">Funil Ebook Gratuito</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: "Landing Page Views", value: mockData.funnel.ebookLanding, percent: 100 },
                {
                  label: "Formulário Iniciado",
                  value: mockData.funnel.formStarted,
                  percent: Math.round((mockData.funnel.formStarted / mockData.funnel.ebookLanding) * 100),
                },
                {
                  label: "Formulário Submetido",
                  value: mockData.funnel.formSubmitted,
                  percent: Math.round((mockData.funnel.formSubmitted / mockData.funnel.ebookLanding) * 100),
                },
                {
                  label: "PDF Descarregado",
                  value: mockData.funnel.pdfDownloaded,
                  percent: Math.round((mockData.funnel.pdfDownloaded / mockData.funnel.ebookLanding) * 100),
                },
              ].map((step, index) => (
                <div key={step.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">{step.label}</span>
                    <span className="text-white font-medium">
                      {step.value.toLocaleString()} ({step.percent}%)
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${step.percent}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Taxa Conversão Total:</span>
                <span className="text-green-400 font-bold">
                  {((mockData.funnel.pdfDownloaded / mockData.funnel.ebookLanding) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* PRO Funnel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#C5A059]/10 rounded-lg">
                <Crown className="text-[#C5A059]" size={20} />
              </div>
              <h2 className="text-xl font-serif text-white">Funil PRO</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: "Página PRO Views", value: mockData.proFunnel.proPageView, percent: 100 },
                {
                  label: "Plano Selecionado",
                  value: mockData.proFunnel.planSelected,
                  percent: Math.round((mockData.proFunnel.planSelected / mockData.proFunnel.proPageView) * 100),
                },
                {
                  label: "Checkout Iniciado",
                  value: mockData.proFunnel.checkoutStarted,
                  percent: Math.round((mockData.proFunnel.checkoutStarted / mockData.proFunnel.proPageView) * 100),
                },
                {
                  label: "Pagamento Completo",
                  value: mockData.proFunnel.paymentCompleted,
                  percent: Math.round((mockData.proFunnel.paymentCompleted / mockData.proFunnel.proPageView) * 100),
                },
              ].map((step, index) => (
                <div key={step.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">{step.label}</span>
                    <span className="text-white font-medium">
                      {step.value.toLocaleString()} ({step.percent}%)
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${step.percent}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Taxa Conversão Total:</span>
                <span className="text-[#C5A059] font-bold">
                  {((mockData.proFunnel.paymentCompleted / mockData.proFunnel.proPageView) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Email Stats + Sources */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Email Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Mail className="text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-serif text-white">Email Performance</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-white">{mockData.emailStats.totalSent}</p>
                <p className="text-zinc-500 text-sm">Emails Enviados</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-400">{mockData.emailStats.openRate}%</p>
                <p className="text-zinc-500 text-sm">Taxa Abertura</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-white">{mockData.emailStats.opened}</p>
                <p className="text-zinc-500 text-sm">Abertos</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-400">{mockData.emailStats.clickRate}%</p>
                <p className="text-zinc-500 text-sm">Taxa Cliques</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-zinc-500 text-sm">
                💡 <strong>Dica:</strong> Taxa de abertura acima de 40% é excelente!
                Continua a otimizar os assuntos dos emails.
              </p>
            </div>
          </motion.div>

          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="text-purple-400" size={20} />
              </div>
              <h2 className="text-xl font-serif text-white">Fontes de Tráfego</h2>
            </div>

            <div className="space-y-4">
              {mockData.topSources.map((source, index) => (
                <div key={source.source}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-300">{source.source}</span>
                    <span className="text-white font-medium">
                      {source.visitors.toLocaleString()} ({source.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Conversions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Zap className="text-green-400" size={20} />
              </div>
              <h2 className="text-xl font-serif text-white">Conversões Recentes</h2>
            </div>
            <Link
              href="/admin/subscriptions"
              className="text-sm text-[#C5A059] hover:text-white transition-colors flex items-center gap-1"
            >
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-zinc-500 text-sm font-medium pb-3">Data</th>
                  <th className="text-left text-zinc-500 text-sm font-medium pb-3">Plano</th>
                  <th className="text-left text-zinc-500 text-sm font-medium pb-3">Email</th>
                  <th className="text-right text-zinc-500 text-sm font-medium pb-3">Valor</th>
                </tr>
              </thead>
              <tbody>
                {mockData.recentConversions.map((conversion, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-4 text-zinc-400 text-sm">{conversion.date}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-sm rounded-full">
                        {conversion.type}
                      </span>
                    </td>
                    <td className="py-4 text-zinc-300 text-sm">{conversion.email}</td>
                    <td className="py-4 text-white font-medium text-right">€{conversion.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link
            href="/ebook-gratis"
            className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl hover:border-green-500/30 transition-colors group"
          >
            <BookOpen className="text-green-400 mb-4" size={24} />
            <h3 className="text-white font-medium mb-2">Ver Landing Ebook</h3>
            <p className="text-zinc-500 text-sm">Abrir página do ebook gratuito</p>
          </Link>

          <Link
            href="/pro"
            className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl hover:border-[#C5A059]/30 transition-colors group"
          >
            <Crown className="text-[#C5A059] mb-4" size={24} />
            <h3 className="text-white font-medium mb-2">Ver Página PRO</h3>
            <p className="text-zinc-500 text-sm">Abrir página de subscrição</p>
          </Link>

          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl hover:border-blue-500/30 transition-colors group"
          >
            <TrendingUp className="text-blue-400 mb-4" size={24} />
            <h3 className="text-white font-medium mb-2">Google Analytics</h3>
            <p className="text-zinc-500 text-sm">Abrir dashboard completo</p>
          </a>
        </div>
      </div>
    </main>
  );
}

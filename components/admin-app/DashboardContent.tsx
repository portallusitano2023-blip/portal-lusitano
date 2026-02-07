"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Mail,
  ShoppingCart,
  Users,
  Calendar,
  Star,
  Eye,
  Settings,
  RefreshCw,
  Plus,
  X,
  Grid,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
} from "lucide-react";

// ========================================
// TIPOS
// ========================================

interface Widget {
  id: string;
  title: string;
  enabled: boolean;
  size: "small" | "medium" | "large";
  category: "metrics" | "charts" | "lists" | "actions";
}

interface DashboardData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    mrr: number;
  };
  messages: {
    total: number;
    unread: number;
    last24h: number;
    responseRate: number;
  };
  cavalos: {
    total: number;
    active: number;
    sold: number;
    views: number;
  };
  events: {
    total: number;
    upcoming: number;
    featured: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    time: string;
    icon: string;
  }>;
  quickStats: {
    todayRevenue: number;
    newLeads: number;
    pendingReviews: number;
    activeUsers: number;
  };
}

// ========================================
// WIDGETS COMPONENTS
// ========================================

const RevenueWidget = ({ data }: { data: any }) => {
  const growth = data?.growth ?? 0;
  const isPositive = growth >= 0;

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Receita Total</p>
            <h3 className="text-2xl font-bold text-white">
              €{((data?.total ?? 0) / 100).toLocaleString("pt-PT")}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Este Mês</span>
          <span className="text-white font-semibold">
            €{((data?.thisMonth ?? 0) / 100).toLocaleString("pt-PT")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">MRR</span>
          <span className="text-green-400 font-semibold">
            €{((data?.mrr ?? 0) / 100).toLocaleString("pt-PT")}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-green-400" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-sm font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? "+" : ""}{growth.toFixed(1)}% vs mês anterior
          </span>
        </div>
      </div>
    </div>
  );
};

const MessagesWidget = ({ data }: { data: any }) => {
  const urgency = data.unread > 10 ? "high" : data.unread > 5 ? "medium" : "low";

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center relative">
            <Mail className="w-6 h-6 text-blue-400" />
            {data.unread > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {data.unread > 99 ? "99+" : data.unread}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-400">Mensagens</p>
            <h3 className="text-2xl font-bold text-white">{data.total}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Não Lidas</span>
          <span className={`font-semibold ${
            urgency === "high" ? "text-red-400" :
            urgency === "medium" ? "text-yellow-400" : "text-gray-400"
          }`}>
            {data.unread}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Últimas 24h</span>
          <span className="text-white font-semibold">{data.last24h}</span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <Target className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-semibold">
            {data.responseRate}% taxa de resposta
          </span>
        </div>
      </div>
    </div>
  );
};

const QuickStatsWidget = ({ data }: { data: any }) => {
  const stats = [
    { label: "Receita Hoje", value: `€${(data.todayRevenue / 100).toFixed(0)}`, icon: DollarSign, color: "green" },
    { label: "Novos Leads", value: data.newLeads, icon: Users, color: "blue" },
    { label: "Reviews Pendentes", value: data.pendingReviews, icon: Star, color: "yellow" },
    { label: "Utilizadores Ativos", value: data.activeUsers, icon: Eye, color: "purple" },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#C5A059]" />
          Stats Rápidas
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorMap: Record<string, string> = {
            green: "text-green-400 bg-green-500/10",
            blue: "text-blue-400 bg-blue-500/10",
            yellow: "text-yellow-400 bg-yellow-500/10",
            purple: "text-purple-400 bg-purple-500/10",
          };

          return (
            <div key={index} className="bg-black/20 rounded-lg p-3 hover:bg-black/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 ${colorMap[stat.color]} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RecentActivityWidget = ({ data }: { data: any[] }) => {
  const getIconColor = (type: string) => {
    const map: Record<string, string> = {
      payment: "text-green-400",
      message: "text-blue-400",
      review: "text-yellow-400",
      sale: "text-purple-400",
    };
    return map[type] || "text-gray-400";
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#C5A059]" />
          Atividade Recente
        </h3>
        <button className="text-xs text-gray-400 hover:text-white transition-colors">
          Ver Tudo
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {data.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className={`text-lg ${getIconColor(activity.type)}`}>{activity.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickActionsWidget = () => {
  const actions = [
    { label: "Novo Cavalo", icon: Plus, color: "bg-green-500", action: () => console.log("novo cavalo") },
    { label: "Novo Evento", icon: Calendar, color: "bg-blue-500", action: () => console.log("novo evento") },
    { label: "Ver Mensagens", icon: Mail, color: "bg-purple-500", action: () => console.log("mensagens") },
    { label: "Analytics", icon: TrendingUp, color: "bg-orange-500", action: () => console.log("analytics") },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-[#C5A059]" />
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} hover:opacity-90 text-white rounded-lg p-4 flex flex-col items-center gap-2 transition-all hover:scale-105`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-semibold">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AlertsWidget = () => {
  const alerts = [
    { type: "warning", message: "5 reviews pendentes de aprovação", action: "Ver" },
    { type: "info", message: "Backup automático concluído", action: "OK" },
    { type: "success", message: "Meta de receita mensal atingida! 🎉", action: "Ver" },
  ];

  const getAlertStyle = (type: string) => {
    const styles: Record<string, string> = {
      warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
      info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      success: "bg-green-500/10 border-green-500/20 text-green-400",
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-[#C5A059]" />
        Alertas
      </h3>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className={`border rounded-lg p-3 flex items-center justify-between ${getAlertStyle(alert.type)}`}>
            <p className="text-sm flex-1">{alert.message}</p>
            <button className="text-xs px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors">
              {alert.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========================================
// DASHBOARD PRINCIPAL
// ========================================

export default function DashboardContentNew() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCustomize, setShowCustomize] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "revenue", title: "Receita", enabled: true, size: "medium", category: "metrics" },
    { id: "messages", title: "Mensagens", enabled: true, size: "medium", category: "metrics" },
    { id: "quickStats", title: "Stats Rápidas", enabled: true, size: "large", category: "metrics" },
    { id: "activity", title: "Atividade Recente", enabled: true, size: "large", category: "lists" },
    { id: "actions", title: "Quick Actions", enabled: true, size: "medium", category: "actions" },
    { id: "alerts", title: "Alertas", enabled: true, size: "medium", category: "actions" },
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar dados de múltiplas APIs em paralelo
      const [statsRes, financialRes, messagesRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/financeiro/overview"),
        fetch("/api/admin/messages/stats"),
      ]);

      const stats = await statsRes.json();
      const financial = await financialRes.json();
      const messages = await messagesRes.json();

      // Mock de atividade recente (você pode criar uma API real para isso)
      const recentActivity = [
        { id: "1", type: "payment", message: "Novo pagamento de €49 recebido", time: "Há 5 min", icon: "💰" },
        { id: "2", type: "message", message: "Nova mensagem de João Silva", time: "Há 12 min", icon: "📧" },
        { id: "3", type: "review", message: "Review aprovada para Cavalo X", time: "Há 1 hora", icon: "⭐" },
        { id: "4", type: "sale", message: "Cavalo vendido: €15,000", time: "Há 2 horas", icon: "🐴" },
      ];

      setDashboardData({
        revenue: financial.overview || {
          total: 0,
          thisMonth: 0,
          lastMonth: 0,
          growth: 0,
          mrr: 0,
        },
        messages: messages || {
          total: 0,
          unread: 0,
          last24h: 0,
          responseRate: 0,
        },
        cavalos: {
          total: stats?.totalCavalos || 0,
          active: stats?.activeCavalos || 0,
          sold: stats?.soldCavalos || 0,
          views: stats?.cavalosViews || 0,
        },
        events: {
          total: stats?.totalEventos || 0,
          upcoming: stats?.futureEventos || 0,
          featured: stats?.featuredEventos || 0,
        },
        recentActivity,
        quickStats: {
          todayRevenue: 4900,
          newLeads: 12,
          pendingReviews: 5,
          activeUsers: 234,
        },
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C5A059] mx-auto mb-4"></div>
          <p className="text-gray-400">A carregar dashboard...</p>
        </div>
      </div>
    );
  }

  const enabledWidgets = widgets.filter((w) => w.enabled);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-gray-400">Bem-vindo de volta! Aqui está o resumo do teu negócio</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>

          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="flex items-center gap-2 px-4 py-2 bg-[#C5A059] hover:bg-[#d4b469] text-black font-semibold rounded-lg transition-all"
          >
            <Grid className="w-4 h-4" />
            Personalizar
          </button>
        </div>
      </div>

      {/* Painel de Customização */}
      {showCustomize && (
        <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Escolhe os teus Widgets
            </h3>
            <button
              onClick={() => setShowCustomize(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {widgets.map((widget) => (
              <button
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${widget.enabled
                    ? "border-[#C5A059] bg-[#C5A059]/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{widget.title}</span>
                  {widget.enabled && <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />}
                </div>
                <span className="text-xs text-gray-400">{widget.category}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData && (
          <>
            {enabledWidgets.find((w) => w.id === "revenue") && (
              <RevenueWidget data={dashboardData.revenue} />
            )}

            {enabledWidgets.find((w) => w.id === "messages") && (
              <MessagesWidget data={dashboardData.messages} />
            )}

            {enabledWidgets.find((w) => w.id === "quickStats") && (
              <div className="md:col-span-2 lg:col-span-3">
                <QuickStatsWidget data={dashboardData.quickStats} />
              </div>
            )}

            {enabledWidgets.find((w) => w.id === "activity") && (
              <div className="md:col-span-2">
                <RecentActivityWidget data={dashboardData.recentActivity} />
              </div>
            )}

            {enabledWidgets.find((w) => w.id === "actions") && (
              <QuickActionsWidget />
            )}

            {enabledWidgets.find((w) => w.id === "alerts") && (
              <AlertsWidget />
            )}
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Subscription {
  id: string;
  user_name: string;
  user_email: string;
  plan_name: string;
  plan_interval: "monthly" | "yearly";
  status: "active" | "cancelled" | "past_due" | "trialing";
  amount: number;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    // TODO: Fetch from Supabase
    // Mock data para demonstração
    setTimeout(() => {
      const mockData: Subscription[] = [
        {
          id: "sub_1",
          user_name: "João Silva",
          user_email: "joao@example.com",
          plan_name: "Elite",
          plan_interval: "monthly",
          status: "active",
          amount: 199,
          current_period_end: new Date(
            Date.now() + 20 * 24 * 60 * 60 * 1000
          ).toISOString(),
          cancel_at_period_end: false,
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_2",
          user_name: "Maria Santos",
          user_email: "maria@example.com",
          plan_name: "Criador",
          plan_interval: "yearly",
          status: "active",
          amount: 499.99,
          current_period_end: new Date(
            Date.now() + 300 * 24 * 60 * 60 * 1000
          ).toISOString(),
          cancel_at_period_end: false,
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_3",
          user_name: "Pedro Costa",
          user_email: "pedro@example.com",
          plan_name: "Aficionado",
          plan_interval: "monthly",
          status: "past_due",
          amount: 9.99,
          current_period_end: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          cancel_at_period_end: false,
          created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_4",
          user_name: "Ana Rodrigues",
          user_email: "ana@example.com",
          plan_name: "Criador",
          plan_interval: "monthly",
          status: "active",
          amount: 49.99,
          current_period_end: new Date(
            Date.now() + 15 * 24 * 60 * 60 * 1000
          ).toISOString(),
          cancel_at_period_end: true,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setSubscriptions(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: "Ativo", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
      past_due: { label: "Pagamento Atrasado", color: "bg-yellow-100 text-yellow-800" },
      trialing: { label: "Trial", color: "bg-blue-100 text-blue-800" },
    };
    const badge = badges[status as keyof typeof badges] || badges.active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      Aficionado: "bg-blue-100 text-blue-800",
      Criador: "bg-amber-100 text-amber-800",
      Elite: "bg-purple-100 text-purple-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[plan as keyof typeof colors]}`}
      >
        {plan}
      </span>
    );
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesPlan = filterPlan === "all" || sub.plan_name === filterPlan;
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      sub.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlan && matchesStatus && matchesSearch;
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === "active").length,
    past_due: subscriptions.filter((s) => s.status === "past_due").length,
    cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👥 Gestão de Subscrições
          </h1>
          <p className="text-gray-600">Gerir todas as subscrições ativas e inativas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-sm text-green-700">Ativos</p>
            <p className="text-2xl font-bold text-green-900">{stats.active}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <p className="text-sm text-yellow-700">Pagamento Atrasado</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.past_due}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <p className="text-sm text-red-700">Cancelados</p>
            <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pesquisar
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nome ou email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por Plano
              </label>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Todos os Planos</option>
                <option value="Aficionado">Aficionado</option>
                <option value="Criador">Criador</option>
                <option value="Elite">Elite</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="past_due">Pagamento Atrasado</option>
                <option value="cancelled">Cancelado</option>
                <option value="trialing">Trial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscriptions List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">A carregar subscrições...</p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">Nenhuma subscrição encontrada.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilizador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Renovação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((sub) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-gray-900">{sub.user_name}</p>
                        <p className="text-sm text-gray-500">{sub.user_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getPlanBadge(sub.plan_name)}
                        <p className="text-xs text-gray-500">
                          {sub.plan_interval === "monthly" ? "Mensal" : "Anual"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(sub.status)}
                      {sub.cancel_at_period_end && (
                        <p className="text-xs text-red-600 mt-1">⚠️ Cancelará no fim</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-900">€{sub.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {sub.plan_interval === "monthly" ? "/mês" : "/ano"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">
                        {new Date(sub.current_period_end).toLocaleDateString("pt-PT")}
                      </p>
                      <p className="text-xs text-gray-500">
                        Membro desde{" "}
                        {new Date(sub.created_at).toLocaleDateString("pt-PT")}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-amber-600 hover:text-amber-800 font-medium">
                        Ver Detalhes
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition">
            📥 Exportar para CSV
          </button>
        </div>
      </div>
    </div>
  );
}

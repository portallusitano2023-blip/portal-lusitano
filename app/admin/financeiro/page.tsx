"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiTrendingUp,
  FiDollarSign,
  FiRepeat,
  FiShoppingCart,
  FiDownload,
  FiFilter,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface OverviewData {
  overview: {
    totalRevenue: number;
    thisMonthRevenue: number;
    lastMonthRevenue: number;
    growthPercentage: number;
    mrr: number;
    averageTicket: number;
    totalTransactions: number;
  };
  revenueByProduct: Array<{
    type: string;
    amount: number;
  }>;
}

interface ChartData {
  dailyRevenue: Array<{ date: string; revenue: number }>;
  monthlyRevenue: Array<{ month: string; fullMonth: string; revenue: number }>;
  revenueByProduct: Array<{
    type: string;
    typeKey: string;
    revenue: number;
    count: number;
  }>;
  mrrEvolution: Array<{ month: string; fullMonth: string; mrr: number }>;
}

interface Transaction {
  id: string;
  date: string;
  email: string;
  productType: string;
  productTypeKey: string;
  amount: number;
  currency: string;
  status: string;
  statusKey: string;
  description: string;
}

interface TransactionsData {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminFinanceiroPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estado dos dados
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [transactionsData, setTransactionsData] = useState<TransactionsData | null>(null);

  // Estado dos filtros
  const [filters, setFilters] = useState({
    product_type: "all",
    status: "all",
    start_date: "",
    end_date: "",
    search: "",
  });

  // Estado da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (!data.authenticated) {
          router.push("/admin/login");
          return;
        }

        setIsAuthenticated(true);
        fetchAllData();
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchOverview(),
        fetchCharts(),
        fetchTransactions(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch overview
  const fetchOverview = async () => {
    try {
      const res = await fetch("/api/admin/financeiro/overview");
      if (!res.ok) throw new Error("Failed to fetch overview");
      const data = await res.json();
      setOverviewData(data);
    } catch (error) {
      console.error("Overview error:", error);
    }
  };

  // Fetch charts
  const fetchCharts = async () => {
    try {
      const res = await fetch("/api/admin/financeiro/charts");
      if (!res.ok) throw new Error("Failed to fetch charts");
      const data = await res.json();
      setChartData(data);
    } catch (error) {
      console.error("Charts error:", error);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const res = await fetch(`/api/admin/financeiro/transactions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactionsData(data);
    } catch (error) {
      console.error("Transactions error:", error);
    }
  };

  // Atualizar filtros
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Aplicar filtros
  const applyFilters = () => {
    fetchTransactions();
  };

  // Exportar CSV
  const exportCSV = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/admin/financeiro/export?${params}`);
      if (!res.ok) throw new Error("Failed to export");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transacoes_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Erro ao exportar CSV");
    }
  };

  // Mudar página
  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [currentPage, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Financeiro</h1>
              <p className="text-gray-400 mt-1">
                Gestão completa de receitas e transações
              </p>
            </div>
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Voltar ao Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        {overviewData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Receita Total */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Receita Total</h3>
                <FiDollarSign className="text-[#C5A059]" size={20} />
              </div>
              <p className="text-3xl font-bold text-white">
                €{overviewData.overview.totalRevenue.toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">Desde o início</p>
            </div>

            {/* Receita Este Mês */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Este Mês</h3>
                <FiTrendingUp className="text-green-500" size={20} />
              </div>
              <p className="text-3xl font-bold text-white">
                €{overviewData.overview.thisMonthRevenue.toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className={`text-xs mt-1 ${
                overviewData.overview.growthPercentage >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}>
                {overviewData.overview.growthPercentage >= 0 ? "+" : ""}
                {overviewData.overview.growthPercentage.toFixed(1)}% vs mês passado
              </p>
            </div>

            {/* MRR */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">MRR</h3>
                <FiRepeat className="text-[#C5A059]" size={20} />
              </div>
              <p className="text-3xl font-bold text-white">
                €{overviewData.overview.mrr.toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">Receita recorrente mensal</p>
            </div>

            {/* Transações */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Transações</h3>
                <FiShoppingCart className="text-[#C5A059]" size={20} />
              </div>
              <p className="text-3xl font-bold text-white">
                {overviewData.overview.totalTransactions}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ticket médio: €{overviewData.overview.averageTicket.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {chartData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Receita Diária */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Receita Diária (Últimos 30 Dias)
              </h3>
              <div className="h-64 flex items-end justify-between gap-1">
                {chartData.dailyRevenue.slice(-30).map((day, index) => {
                  const maxRevenue = Math.max(
                    ...chartData.dailyRevenue.map((d) => d.revenue)
                  );
                  const height = maxRevenue > 0
                    ? (day.revenue / maxRevenue) * 100
                    : 0;

                  return (
                    <div
                      key={index}
                      className="group relative flex-1"
                      style={{ height: "100%" }}
                    >
                      <div
                        className="absolute bottom-0 w-full bg-[#C5A059] rounded-t transition-all hover:bg-[#d4b469] cursor-pointer"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {new Date(day.date).toLocaleDateString("pt-PT")}
                          <br />
                          €{day.revenue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Receita por Produto */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Receita por Produto
              </h3>
              <div className="space-y-4">
                {chartData.revenueByProduct.map((product, index) => {
                  const totalRevenue = chartData.revenueByProduct.reduce(
                    (sum, p) => sum + p.revenue,
                    0
                  );
                  const percentage = totalRevenue > 0
                    ? (product.revenue / totalRevenue) * 100
                    : 0;

                  const colors = [
                    "#C5A059",
                    "#8B7042",
                    "#A08850",
                    "#666",
                  ];

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">{product.type}</span>
                        <span className="text-sm font-semibold text-white">
                          €{product.revenue.toFixed(2)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: colors[index % colors.length],
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.count} transações
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Crescimento Mensal */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Crescimento Mensal (Últimos 12 Meses)
              </h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {chartData.monthlyRevenue.map((month, index) => {
                  const maxRevenue = Math.max(
                    ...chartData.monthlyRevenue.map((m) => m.revenue)
                  );
                  const height = maxRevenue > 0
                    ? (month.revenue / maxRevenue) * 100
                    : 0;

                  return (
                    <div
                      key={index}
                      className="group relative flex-1"
                      style={{ height: "100%" }}
                    >
                      <div
                        className="absolute bottom-8 w-full bg-gradient-to-t from-[#C5A059] to-[#d4b469] rounded-t transition-all hover:from-[#d4b469] hover:to-[#e4c479] cursor-pointer"
                        style={{ height: `calc(${height}% - 2rem)` }}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {month.fullMonth}
                          <br />
                          €{month.revenue.toFixed(2)}
                        </div>
                      </div>
                      <p className="absolute bottom-0 w-full text-center text-xs text-gray-500">
                        {month.month}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evolução MRR */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Evolução MRR
              </h3>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="mrrGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#C5A059" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Área sob a curva */}
                  {chartData.mrrEvolution.length > 0 && (
                    <>
                      {(() => {
                        const maxMRR = Math.max(...chartData.mrrEvolution.map((m) => m.mrr));
                        const points = chartData.mrrEvolution.map((month, index) => {
                          const x = (index / (chartData.mrrEvolution.length - 1)) * 400;
                          const y = maxMRR > 0
                            ? 200 - (month.mrr / maxMRR) * 180
                            : 200;
                          return `${x},${y}`;
                        }).join(" ");

                        const areaPoints = `0,200 ${points} 400,200`;

                        return (
                          <>
                            <polyline
                              points={areaPoints}
                              fill="url(#mrrGradient)"
                            />
                            <polyline
                              points={points}
                              fill="none"
                              stroke="#C5A059"
                              strokeWidth="2"
                            />
                          </>
                        );
                      })()}
                    </>
                  )}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                  {chartData.mrrEvolution.filter((_, i) => i % 2 === 0).map((month, index) => (
                    <span key={index} className="text-xs text-gray-500">
                      {month.month}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Transações</h3>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#C5A059] hover:bg-[#d4b469] text-black font-medium rounded-lg transition-colors"
            >
              <FiDownload size={16} />
              Exportar CSV
            </button>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {/* Tipo de Produto */}
            <select
              value={filters.product_type}
              onChange={(e) => handleFilterChange("product_type", e.target.value)}
              className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">Todos os produtos</option>
              <option value="cavalo_anuncio">Anúncios de Cavalos</option>
              <option value="instagram_ad">Instagram</option>
              <option value="publicidade">Publicidade</option>
            </select>

            {/* Status */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">Todos os status</option>
              <option value="succeeded">Sucesso</option>
              <option value="pending">Pendente</option>
              <option value="failed">Falhado</option>
            </select>

            {/* Data Início */}
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
              className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />

            {/* Data Fim */}
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
              className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />

            {/* Pesquisa */}
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar email..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 pl-9 bg-black/30 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C5A059]"
              />
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
            </div>
          </div>

          <button
            onClick={applyFilters}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors"
          >
            <FiFilter size={16} />
            Aplicar Filtros
          </button>

          {/* Tabela */}
          {transactionsData && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">
                        Data
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">
                        Email
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">
                        Produto
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">
                        Valor
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {transactionsData.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-300">
                          {new Date(transaction.date).toLocaleDateString("pt-PT")}
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleTimeString("pt-PT", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-white">
                          {transaction.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-300">
                          {transaction.productType}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-white">
                          €{transaction.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.statusKey === "succeeded"
                                ? "bg-green-500/10 text-green-500"
                                : transaction.statusKey === "pending"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                <div className="text-sm text-gray-400">
                  Mostrando {((transactionsData.pagination.page - 1) * transactionsData.pagination.limit) + 1} a{" "}
                  {Math.min(
                    transactionsData.pagination.page * transactionsData.pagination.limit,
                    transactionsData.pagination.total
                  )}{" "}
                  de {transactionsData.pagination.total} transações
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  {Array.from(
                    { length: Math.min(5, transactionsData.pagination.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => changePage(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-[#C5A059] text-black font-semibold"
                              : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === transactionsData.pagination.totalPages}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

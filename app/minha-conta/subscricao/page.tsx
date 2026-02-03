"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  Crown,
  ArrowLeft,
  RefreshCw,
  XCircle,
  Loader2,
} from "lucide-react";

interface Subscription {
  id: string;
  plan_name: string;
  billing_period: "monthly" | "yearly";
  amount: number;
  currency: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancelled_at: string | null;
  stripe_customer_id: string;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      // Obter email do utilizador atual (pode vir de cookies ou session)
      const response = await fetch("/api/subscription/current");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      } else if (response.status === 404) {
        setSubscription(null);
      } else {
        setError("Erro ao carregar dados da subscricao");
      }
    } catch (err) {
      console.error("Erro:", err);
      setError("Erro de conexao");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Tem a certeza que deseja cancelar a sua subscricao? Mantera acesso ate ao fim do periodo atual.")) {
      return;
    }

    setCancelling(true);
    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      if (response.ok) {
        await fetchSubscription();
        alert("Subscricao cancelada com sucesso. Mantera acesso ate ao fim do periodo atual.");
      } else {
        alert("Erro ao cancelar subscricao. Tente novamente.");
      }
    } catch (err) {
      alert("Erro ao cancelar subscricao.");
    } finally {
      setCancelling(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch("/api/subscription/portal", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        alert("Erro ao abrir portal de pagamentos");
      }
    } catch (err) {
      alert("Erro ao abrir portal de pagamentos");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/minha-conta"
            className="inline-flex items-center text-zinc-500 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar a Minha Conta
          </Link>
          <h1 className="text-3xl font-serif text-white">Gestao de Subscricao</h1>
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        {!subscription ? (
          /* Sem Subscricao */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 border border-white/10 p-8 text-center"
          >
            <Crown className="mx-auto text-zinc-600 mb-4" size={48} />
            <h2 className="text-xl font-serif text-white mb-2">
              Sem Subscricao Ativa
            </h2>
            <p className="text-zinc-500 mb-6">
              Torne-se membro PRO e desbloqueie todos os beneficios exclusivos.
            </p>
            <Link
              href="/pro"
              className="inline-block bg-[#C5A059] text-black px-6 py-3 font-bold hover:bg-white transition-colors"
            >
              Ver Planos PRO
            </Link>
          </motion.div>
        ) : (
          /* Com Subscricao */
          <div className="space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`border p-6 ${
                subscription.status === "active"
                  ? "bg-green-500/5 border-green-500/30"
                  : subscription.cancelled_at
                  ? "bg-amber-500/5 border-amber-500/30"
                  : "bg-red-500/5 border-red-500/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {subscription.status === "active" && !subscription.cancelled_at ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : subscription.cancelled_at ? (
                  <AlertCircle className="text-amber-500" size={24} />
                ) : (
                  <XCircle className="text-red-500" size={24} />
                )}
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {subscription.plan_name || "Plano PRO"}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {subscription.cancelled_at
                      ? "Cancelado - Acesso ate ao fim do periodo"
                      : subscription.status === "active"
                      ? "Subscricao Ativa"
                      : "Subscricao Inativa"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500">Valor</span>
                  <p className="text-white font-semibold">
                    {formatCurrency(subscription.amount, subscription.currency)}
                    <span className="text-zinc-500 font-normal">
                      /{subscription.billing_period === "yearly" ? "ano" : "mes"}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-zinc-500">Proximo pagamento</span>
                  <p className="text-white">
                    {subscription.cancelled_at
                      ? "Cancelado"
                      : formatDate(subscription.current_period_end)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Detalhes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 border border-white/10 p-6"
            >
              <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
                <Calendar className="text-[#C5A059]" size={20} />
                Detalhes do Plano
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-zinc-500">Periodo de faturacao</span>
                  <span className="text-white">
                    {subscription.billing_period === "yearly" ? "Anual" : "Mensal"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-zinc-500">Inicio do periodo atual</span>
                  <span className="text-white">
                    {formatDate(subscription.current_period_start)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-zinc-500">Fim do periodo atual</span>
                  <span className="text-white">
                    {formatDate(subscription.current_period_end)}
                  </span>
                </div>
                {subscription.cancelled_at && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500">Data de cancelamento</span>
                    <span className="text-amber-400">
                      {formatDate(subscription.cancelled_at)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Beneficios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 border border-white/10 p-6"
            >
              <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
                <Crown className="text-[#C5A059]" size={20} />
                Os seus beneficios
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Acesso a toda a biblioteca de conteudo",
                  "Consultorias com especialistas",
                  "Badge de membro verificado",
                  "Destaque no diretorio de coudelarias",
                  "Suporte prioritario",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Acoes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <button
                onClick={handleManageBilling}
                className="w-full flex items-center justify-center gap-2 bg-[#C5A059] text-black py-3 px-4 font-bold hover:bg-white transition-colors"
              >
                <CreditCard size={18} />
                Gerir Metodo de Pagamento
              </button>

              {subscription.status === "active" && !subscription.cancelled_at && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="w-full flex items-center justify-center gap-2 border border-red-500/50 text-red-400 py-3 px-4 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {cancelling ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                  {cancelling ? "A cancelar..." : "Cancelar Subscricao"}
                </button>
              )}

              {subscription.cancelled_at && (
                <button
                  onClick={handleManageBilling}
                  className="w-full flex items-center justify-center gap-2 border border-green-500/50 text-green-400 py-3 px-4 hover:bg-green-500/10 transition-colors"
                >
                  <RefreshCw size={18} />
                  Reativar Subscricao
                </button>
              )}
            </motion.div>

            {/* Ajuda */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-zinc-500"
            >
              <p>
                Precisa de ajuda?{" "}
                <a
                  href="mailto:portal.lusitano2023@gmail.com"
                  className="text-[#C5A059] hover:underline"
                >
                  Contacte-nos
                </a>
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}

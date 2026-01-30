"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Crown,
  BookOpen,
  Sparkles,
  Check,
  Lock,
  CreditCard,
  Shield,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const plans = {
  aficionado: {
    name: "Aficionado",
    icon: BookOpen,
    price: { monthly: 9.99, yearly: 99.90 },
    color: "from-zinc-600 to-zinc-800",
    features: [
      "5 Ebooks exclusivos por mês",
      "Newsletter semanal premium",
      "Comunidade online privada",
      "Guias PDF descargáveis",
    ],
  },
  criador: {
    name: "Criador",
    icon: Crown,
    price: { monthly: 49.99, yearly: 499.90 },
    color: "from-[#C5A059] to-[#8B6914]",
    features: [
      "Tudo do plano Aficionado",
      "Biblioteca completa (50+ Ebooks)",
      "Templates e documentos PRO",
      "Planners de gestão",
      "Consultoria por email (2x/mês)",
      "Certificados digitais",
    ],
  },
  elite: {
    name: "Elite",
    icon: Sparkles,
    price: { monthly: 199, yearly: 1990 },
    color: "from-purple-600 to-purple-900",
    features: [
      "Tudo do plano Criador",
      "Consultoria ilimitada (email/chat)",
      "Análise de linhagens personalizada",
      "Networking com criadores elite",
      "Conteúdo exclusivo mensal",
      "Suporte prioritário 24/7",
    ],
  },
};

type PlanId = keyof typeof plans;
type Period = "monthly" | "yearly";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planId = (searchParams.get("plan") as PlanId) || "criador";
  const period = (searchParams.get("period") as Period) || "monthly";

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const plan = plans[planId];
  const price = plan.price[period];
  const Icon = plan.icon;

  const handleCheckout = async () => {
    if (!email) {
      setError("Por favor, introduz o teu email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, period, email }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirecionar para Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError("Ocorreu um erro. Por favor, tenta novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/pro"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar aos planos
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-serif text-white mb-8">
              Resumo do Pedido
            </h1>

            <div className={`bg-gradient-to-b ${plan.color} rounded-xl p-6 mb-6`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Icon className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-white">
                    Plano {plan.name}
                  </h3>
                  <p className="text-white/60 text-sm">
                    Faturação {period === "monthly" ? "mensal" : "anual"}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                      <Check size={14} className="text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400">Plano {plan.name}</span>
                <span className="text-white">€{price.toFixed(2)}</span>
              </div>

              {period === "yearly" && (
                <div className="flex items-center justify-between mb-4 text-green-400">
                  <span>Desconto anual (2 meses grátis)</span>
                  <span>-€{((plan.price.monthly * 12) - price).toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">
                      €{price.toFixed(2)}
                    </span>
                    <span className="text-zinc-500">
                      /{period === "monthly" ? "mês" : "ano"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-serif text-white mb-8">
              Finalizar Compra
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="o-teu-email@exemplo.com"
                  className="w-full bg-zinc-900 border border-white/10 px-4 py-4 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none transition-colors"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-[#C5A059] text-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    A processar...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pagar €{price.toFixed(2)}
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="flex items-center gap-3 text-zinc-500 text-sm">
                <Lock size={16} />
                <span>
                  Pagamento seguro processado pelo Stripe. Os teus dados estão protegidos.
                </span>
              </div>

              {/* Guarantee */}
              <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex items-start gap-3">
                <Shield className="text-[#C5A059] flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-white font-medium mb-1">
                    Garantia de 30 dias
                  </h4>
                  <p className="text-zinc-500 text-sm">
                    Se não estiveres satisfeito, devolvemos o teu dinheiro sem perguntas.
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="text-center">
                <p className="text-zinc-600 text-xs mb-3">Métodos de pagamento aceites</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {/* Visa */}
                  <div className="bg-[#1A1F71] rounded px-3 py-1.5 flex items-center">
                    <span className="text-white font-bold text-sm tracking-wider">VISA</span>
                  </div>

                  {/* Mastercard */}
                  <div className="bg-[#EB001B] rounded px-3 py-1.5 flex items-center">
                    <span className="text-white font-bold text-sm">Mastercard</span>
                  </div>

                  {/* American Express */}
                  <div className="bg-[#006FCF] rounded px-3 py-1.5 flex items-center">
                    <span className="text-white font-bold text-xs tracking-wide">AMERICAN EXPRESS</span>
                  </div>

                  {/* Apple Pay */}
                  <div className="bg-black rounded px-3 py-1.5 flex items-center">
                    <span className="text-white font-semibold text-sm"> Apple Pay</span>
                  </div>

                  {/* Google Pay */}
                  <div className="bg-white rounded px-3 py-1.5 flex items-center border border-gray-200">
                    <span className="font-semibold text-sm"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC04]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span> <span className="text-[#5F6368]">Pay</span></span>
                  </div>

                  {/* PayPal */}
                  <div className="bg-[#0070BA] rounded px-3 py-1.5 flex items-center">
                    <span className="text-white font-bold text-sm">PayPal</span>
                  </div>

                  {/* MB WAY */}
                  <div className="bg-white rounded px-3 py-1.5 flex items-center border border-gray-200">
                    <span className="text-[#D4213D] font-black text-sm tracking-wide">MB WAY</span>
                  </div>
                </div>
                {/* Stripe Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-zinc-500 text-xs">
                  <svg className="h-5 w-auto" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#635BFF" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.02 1.04-.06 1.48zm-6.3-5.63c-1.03 0-1.99.73-2.12 2.27h4.16c-.09-1.35-.8-2.27-2.04-2.27zM35.96 19.82V7.5h4.37l.25 1.44c.9-1.2 2.08-1.7 3.51-1.7v4.35c-.42-.09-.8-.12-1.27-.12-1.03 0-1.97.34-2.5.79v7.56h-4.36zM27.89 19.82V7.5h4.36v12.32h-4.36zm0-14.05V1.65h4.36v4.12h-4.36zM16.36 19.82V7.5h4.37l.25 1.74c.88-1.31 2.22-2.06 3.8-2.06 2.9 0 4.72 2.11 4.72 5.83v6.81h-4.36v-6.26c0-1.58-.59-2.51-1.78-2.51-1.02 0-1.8.53-2.27 1.41v7.36h-4.73zM5.73 8.77c1.45 0 2.44-.48 3.06-1.02l.32 1.03h3.92V1.65H8.67v4.93c-.59-.3-1.38-.47-2.15-.47-3.4 0-5.77 2.34-5.77 6.12 0 3.97 2.1 7.6 5.96 7.6 1.6 0 3.02-.51 4.06-1.35l.19.97h4.05V7.5H5.73c.02 0 0 1.27 0 1.27zm.77 7.37c-1.44 0-2.41-1.22-2.41-3.14 0-1.74.92-2.87 2.42-2.87.72 0 1.37.2 1.89.51v4.74c-.55.47-1.22.76-1.9.76z"/>
                  </svg>
                  <span>Pagamentos seguros</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Crown,
  ArrowRight,
  Loader2,
  Check,
  Zap,
  Download,
  History,
  Share2,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface PaywallProps {
  toolName: string;
  requiresAuth?: boolean;
  proFeatures?: string[];
}

const DEFAULT_PRO_FEATURES = [
  "Uso ilimitado das 4 ferramentas",
  "Exportação PDF profissional",
  "Guardar e partilhar resultados",
  "Histórico completo de avaliações",
];

const FEATURE_ICONS = [Zap, Download, History, Share2];

export default function Paywall({ toolName, requiresAuth = false, proFeatures }: PaywallProps) {
  const features = proFeatures ?? DEFAULT_PRO_FEATURES;
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/registar?redirect=/ferramentas");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/create-checkout", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Não foi possível iniciar o pagamento. Tente novamente.");
        setLoading(false);
      }
    } catch {
      setError("Erro de ligação. Verifique a sua ligação e tente novamente.");
      setLoading(false);
    }
  };

  if (requiresAuth) {
    return (
      <div className="relative rounded-2xl overflow-hidden my-4">
        {/* Blurred content behind */}
        <div className="blur-sm pointer-events-none select-none opacity-30 min-h-[280px] bg-[var(--background-secondary)]/50 rounded-2xl" />

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {/* Gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/85 to-transparent rounded-2xl" />

          <div className="relative z-10 w-full max-w-sm mx-auto px-6 py-8 text-center">
            {/* Icon */}
            <div className="relative mb-6 flex justify-center">
              <div className="w-16 h-16 bg-[var(--gold)]/15 rounded-2xl flex items-center justify-center border border-[var(--gold)]/30 shadow-lg shadow-[var(--gold)]/10">
                <Lock className="text-[var(--gold)]" size={26} />
              </div>
            </div>

            <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">
              Crie uma conta gratuita
            </h3>
            <p className="text-sm text-[var(--foreground-secondary)] mb-1">
              Registe-se para usar a {toolName} sem custo.
            </p>
            <p className="text-xs text-[var(--foreground-muted)] mb-6">
              O primeiro uso é sempre grátis — sem cartão de crédito.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/registar"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black font-semibold rounded-xl hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all shadow-lg shadow-[var(--gold)]/20 hover:shadow-[var(--gold)]/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Criar Conta Grátis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--border)] text-[var(--foreground-secondary)] rounded-xl hover:border-[var(--gold)]/40 hover:text-[var(--foreground)] transition-colors text-sm"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden my-4">
      {/* Blurred background */}
      <div className="blur-sm pointer-events-none select-none opacity-30 min-h-[320px] bg-[var(--background-secondary)]/50 rounded-2xl" />

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/88 to-transparent rounded-2xl" />

        <div className="relative z-10 w-full max-w-sm mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-6">
            {/* Crown icon with glow */}
            <div className="relative mb-5 flex justify-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-[var(--gold)]/20 rounded-full blur-xl" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-[var(--gold)]/20 to-[var(--gold)]/5 rounded-2xl flex items-center justify-center border border-[var(--gold)]/40 shadow-lg shadow-[var(--gold)]/15">
                <Crown className="text-[var(--gold)]" size={26} />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-full mb-4">
              <span className="text-[var(--gold)] text-[10px] font-bold uppercase tracking-widest">
                Oferta de lançamento · 50% OFF
              </span>
            </div>

            <h3 className="text-xl font-serif text-[var(--foreground)] mb-1">
              Já usou o seu uso gratuito
            </h3>
            <p className="text-sm text-[var(--foreground-secondary)] mb-0.5">
              Subscreva PRO para continuar a usar a {toolName}.
            </p>
            <p className="text-xs text-[var(--foreground-muted)]">
              Acesso ilimitado a todas as ferramentas.
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-center gap-1 mb-5">
            <span className="text-4xl font-serif bg-gradient-to-r from-[var(--gold)] to-[#E8D5A3] bg-clip-text text-transparent">
              4,99
            </span>
            <span className="text-[var(--foreground-muted)] text-base">EUR</span>
            <span className="text-[var(--foreground-muted)] text-sm">/mês</span>
            <span className="ml-2 text-xs text-[var(--foreground-muted)] line-through">9,99€</span>
          </div>

          {/* Features */}
          <ul className="space-y-2 mb-6">
            {features.map((f, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={12} className="text-[var(--gold)]" />
                  </div>
                  <span className="text-sm text-[var(--foreground-secondary)]">{f}</span>
                </li>
              );
            })}
          </ul>

          {/* CTA Button */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black font-bold rounded-xl hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all shadow-lg shadow-[var(--gold)]/25 hover:shadow-[var(--gold)]/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />A processar...
              </>
            ) : (
              <>
                <Crown size={18} />
                Subscrever PRO
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Reassurance */}
          <p className="text-center text-[10px] text-[var(--foreground-muted)] mt-3 flex items-center justify-center gap-1">
            <Check size={10} className="text-emerald-400" />
            Cancela a qualquer momento · Sem fidelização
          </p>

          {error && (
            <p className="mt-3 text-sm text-red-400 text-center" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

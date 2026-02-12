"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Crown, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface PaywallProps {
  toolName: string;
  requiresAuth?: boolean;
}

export default function Paywall({ toolName, requiresAuth = false }: PaywallProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/registar?redirect=/ferramentas");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tools/create-checkout", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  };

  if (requiresAuth) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 bg-[var(--gold)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-[var(--gold)]" size={28} />
            </div>
            <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">
              Crie uma conta gratuita
            </h3>
            <p className="text-sm text-[var(--foreground-secondary)] mb-6">
              Registe-se para usar a {toolName} gratuitamente. O primeiro uso e gratis!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/registar"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all"
              >
                Criar Conta Gratis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--border)] text-[var(--foreground-secondary)] rounded-lg hover:border-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Ja tenho conta
              </Link>
            </div>
          </div>
        </div>
        <div className="blur-sm pointer-events-none select-none opacity-50 min-h-[300px] bg-[var(--background-secondary)]/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-[var(--gold)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="text-[var(--gold)]" size={28} />
          </div>
          <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">Ferramentas PRO</h3>
          <p className="text-sm text-[var(--foreground-secondary)] mb-2">
            Ja usou o seu uso gratuito da {toolName}.
          </p>
          <p className="text-sm text-[var(--foreground-muted)] mb-6">
            Subscreva por apenas <span className="text-[var(--gold)] font-bold">4,99 EUR/mes</span>{" "}
            para acesso ilimitado a todas as ferramentas.
          </p>

          <ul className="text-sm text-[var(--foreground-secondary)] space-y-2 mb-6 text-left max-w-xs mx-auto">
            <li className="flex items-center gap-2">
              <span className="text-[var(--gold)]">&#10003;</span> Uso ilimitado das 4 ferramentas
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--gold)]">&#10003;</span> Exportacao PDF profissional
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--gold)]">&#10003;</span> Guardar e partilhar resultados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--gold)]">&#10003;</span> Historico completo de avaliacoes
            </li>
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all shadow-lg shadow-[#C5A059]/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </div>
      <div className="blur-sm pointer-events-none select-none opacity-50 min-h-[300px] bg-[var(--background-secondary)]/50 rounded-2xl" />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface SubscriptionBannerProps {
  freeUsesLeft: number;
  isSubscribed: boolean;
  requiresAuth: boolean;
}

export default function SubscriptionBanner({
  freeUsesLeft,
  isSubscribed,
  requiresAuth,
}: SubscriptionBannerProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/registar?redirect=/ferramentas");
      return;
    }

    setLoading(true);
    setCheckoutError(false);
    try {
      const res = await fetch("/api/tools/create-checkout", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(true);
        setLoading(false);
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("[SubscriptionBanner]", err);
      setCheckoutError(true);
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    setCheckoutError(false);
    try {
      const res = await fetch("/api/tools/customer-portal", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(true);
        setLoading(false);
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("[SubscriptionBanner]", err);
      setCheckoutError(true);
      setLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3 px-4 py-2 min-h-[44px] bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-lg">
          <div className="flex items-center gap-2 min-w-0">
            <Crown size={16} className="text-[var(--gold)] flex-shrink-0" />
            <span className="text-xs text-[var(--gold)] font-medium truncate">
              Ferramentas PRO - Uso Ilimitado
            </span>
          </div>
          <button
            onClick={handleManageSubscription}
            disabled={loading}
            className="text-xs text-[var(--gold)]/70 hover:text-[var(--gold)] font-medium transition-colors disabled:opacity-50 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-end"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : "Gerir"}
          </button>
        </div>
        {checkoutError && (
          <p className="text-xs text-red-400 px-1">Erro ao aceder ao portal. Tente novamente.</p>
        )}
      </div>
    );
  }

  if (requiresAuth) {
    return (
      <Link
        href="/registar"
        className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg hover:border-[var(--gold)]/30 transition-colors group"
      >
        <Zap
          size={16}
          className="text-[var(--foreground-muted)] group-hover:text-[var(--gold)] transition-colors flex-shrink-0"
        />
        <span className="text-xs text-[var(--foreground-secondary)] group-hover:text-[var(--foreground-secondary)] transition-colors">
          Crie uma conta para usar gratuitamente
        </span>
      </Link>
    );
  }

  if (freeUsesLeft > 0) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3 px-4 py-2 min-h-[44px] bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-center gap-2 min-w-0">
            <Zap size={16} className="text-amber-400 flex-shrink-0" />
            <span className="text-xs text-amber-300 truncate">
              {freeUsesLeft} uso{freeUsesLeft !== 1 ? "s" : ""} gratuito
              {freeUsesLeft !== 1 ? "s" : ""} restante{freeUsesLeft !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="text-xs text-[var(--gold)] hover:text-[#D4AF6A] font-medium transition-colors disabled:opacity-50 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-end"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : "Subscrever PRO"}
          </button>
        </div>
        {checkoutError && (
          <p className="text-xs text-red-400 px-1">Erro ao iniciar pagamento. Tente novamente.</p>
        )}
      </div>
    );
  }

  return null;
}

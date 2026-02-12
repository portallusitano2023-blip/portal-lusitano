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
        // Checkout error
        setLoading(false);
      }
    } catch (err) {
      void err;
      // Checkout error
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/customer-portal", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        // Portal error
        setLoading(false);
      }
    } catch (err) {
      void err;
      // Portal error
      setLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Crown size={16} className="text-[var(--gold)]" />
          <span className="text-xs text-[var(--gold)] font-medium">
            Ferramentas PRO - Uso Ilimitado
          </span>
        </div>
        <button
          onClick={handleManageSubscription}
          disabled={loading}
          className="text-xs text-[var(--gold)]/70 hover:text-[var(--gold)] font-medium transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : "Gerir"}
        </button>
      </div>
    );
  }

  if (requiresAuth) {
    return (
      <Link
        href="/registar"
        className="flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg hover:border-[var(--gold)]/30 transition-colors group"
      >
        <Zap
          size={16}
          className="text-[var(--foreground-muted)] group-hover:text-[var(--gold)] transition-colors"
        />
        <span className="text-xs text-[var(--foreground-secondary)] group-hover:text-[var(--foreground-secondary)] transition-colors">
          Crie uma conta para usar gratuitamente
        </span>
      </Link>
    );
  }

  if (freeUsesLeft > 0) {
    return (
      <div className="flex items-center justify-between px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-400" />
          <span className="text-xs text-amber-300">
            {freeUsesLeft} uso{freeUsesLeft !== 1 ? "s" : ""} gratuito
            {freeUsesLeft !== 1 ? "s" : ""} restante{freeUsesLeft !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="text-xs text-[var(--gold)] hover:text-[#D4AF6A] font-medium transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : "Subscrever PRO"}
        </button>
      </div>
    );
  }

  return null;
}

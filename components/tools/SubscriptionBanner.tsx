"use client";

import Link from "next/link";
import { Crown, Zap } from "lucide-react";

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
  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg">
        <Crown size={16} className="text-[#C5A059]" />
        <span className="text-xs text-[#C5A059] font-medium">Ferramentas PRO - Uso Ilimitado</span>
      </div>
    );
  }

  if (requiresAuth) {
    return (
      <Link
        href="/registar"
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-[#C5A059]/30 transition-colors group"
      >
        <Zap size={16} className="text-zinc-500 group-hover:text-[#C5A059] transition-colors" />
        <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
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
        <Link
          href="/ferramentas"
          className="text-xs text-[#C5A059] hover:text-[#D4AF6A] font-medium transition-colors"
        >
          Subscrever PRO
        </Link>
      </div>
    );
  }

  return null;
}

"use client";

import { Crown } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";

interface UsesRemainingProps {
  freeUsesLeft: number;
  totalFreeUses?: number;
  toolName: string;
}

export default function UsesRemaining({ freeUsesLeft, totalFreeUses = 1, toolName }: UsesRemainingProps) {
  if (freeUsesLeft <= 0) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-xl mb-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse" />
        <span className="text-sm text-[var(--foreground-secondary)]">
          <strong className="text-[var(--foreground)]">{freeUsesLeft}</strong> de {totalFreeUses} {freeUsesLeft === 1 ? "uso gratuito restante" : "usos gratuitos restantes"} na {toolName}
        </span>
      </div>
      <LocalizedLink
        href="/precos"
        className="flex items-center gap-1 text-xs text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors font-medium"
      >
        <Crown size={12} />
        Upgrade Pro
      </LocalizedLink>
    </div>
  );
}

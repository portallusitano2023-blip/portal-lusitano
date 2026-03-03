"use client";

import { Crown, History } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

interface ProStatusBarProps {
  /** i18n tool name tuple: [pt, en, es] */
  toolName: [string, string, string];
  isSubscribed: boolean;
  accessLoading: boolean;
  /** Extra condition to show (e.g. step > 0 || !!resultado). Defaults to true. */
  show?: boolean;
  className?: string;
}

/**
 * Shared PRO status bar displayed in tool pages when the user has an active PRO subscription.
 * Shows "PRO Active", "Unlimited uses", tool-specific unlock label, and a history link.
 */
export default function ProStatusBar({
  toolName,
  isSubscribed,
  accessLoading,
  show = true,
  className = "",
}: ProStatusBarProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  if (accessLoading || !isSubscribed || !show) return null;

  return (
    <div
      className={`bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg p-3 flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm ${className}`}
    >
      <Crown size={14} className="text-[#C5A059] shrink-0" aria-hidden="true" />
      <span className="text-[#C5A059] font-semibold">
        {tr("PRO Activo", "PRO Active", "PRO Activo")}
      </span>
      <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
      <span className="text-[#C5A059]/80 hidden sm:inline">
        {tr("Utilizações ilimitadas", "Unlimited uses", "Usos ilimitados")}
      </span>
      <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
      <span className="text-[#C5A059]/80 hidden sm:inline">
        {tr(...toolName)}{" "}
        {tr("desbloqueada", "unlocked", "desbloqueado")}
      </span>
      <LocalizedLink
        href="/ferramentas/historico"
        className="ml-auto text-[#C5A059]/70 hover:text-[#C5A059] transition-colors whitespace-nowrap text-xs sm:text-sm flex items-center gap-1"
      >
        <History size={12} className="hidden sm:inline" />
        {tr("Ver histórico →", "View history →", "Ver historial →")}
      </LocalizedLink>
    </div>
  );
}

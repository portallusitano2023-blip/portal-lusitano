"use client";

import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

interface FreeUsesCounterProps {
  freeUsesLeft: number;
  isSubscribed: boolean;
  accessLoading: boolean;
  /** Extra condition to show (e.g. step > 0 || !!resultado). Defaults to true. */
  show?: boolean;
  className?: string;
}

/**
 * Shared free-uses counter banner displayed in tool pages when the user
 * is NOT subscribed and still has free uses remaining.
 */
export default function FreeUsesCounter({
  freeUsesLeft,
  isSubscribed,
  accessLoading,
  show = true,
  className = "",
}: FreeUsesCounterProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  if (accessLoading || isSubscribed || freeUsesLeft <= 0 || !show) return null;

  return (
    <div
      className={`bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-xs sm:text-sm ${className}`}
    >
      <span className="text-amber-400/90 flex-1 min-w-0">
        {tr(
          `${freeUsesLeft} uso${freeUsesLeft !== 1 ? "s" : ""} gratuito${freeUsesLeft !== 1 ? "s" : ""} disponível${freeUsesLeft !== 1 ? "is" : ""} — Subscreva PRO para utilizações ilimitadas`,
          `${freeUsesLeft} free use${freeUsesLeft !== 1 ? "s" : ""} remaining — Subscribe to PRO for unlimited uses`,
          `${freeUsesLeft} uso${freeUsesLeft !== 1 ? "s" : ""} gratuito${freeUsesLeft !== 1 ? "s" : ""} disponible${freeUsesLeft !== 1 ? "s" : ""} — Suscríbase a PRO para usos ilimitados`
        )}
      </span>
      <LocalizedLink
        href="/ferramentas"
        className="text-amber-400 hover:text-amber-300 transition-colors font-medium whitespace-nowrap"
      >
        {tr("Subscrever →", "Subscribe →", "Suscribirse →")}
      </LocalizedLink>
    </div>
  );
}

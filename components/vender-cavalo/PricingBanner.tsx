"use client";

import { PRECO_ANUNCIO } from "@/components/vender-cavalo/data";
import { useLanguage } from "@/context/LanguageContext";

export default function PricingBanner() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="bg-gradient-to-r from-[var(--gold)]/20 to-[var(--gold)]/5 border border-[var(--gold)]/30 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">{t.vender_cavalo.premium_ad}</h3>
            <p className="text-sm text-[var(--foreground-secondary)]">
              {t.vender_cavalo.premium_desc}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--gold)]">{PRECO_ANUNCIO}€</div>
            <div className="text-xs text-[var(--foreground-muted)]">
              {t.vender_cavalo.single_payment}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

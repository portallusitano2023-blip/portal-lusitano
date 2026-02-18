"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PageHeader() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <Link
        href="/comprar"
        className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors mb-6 touch-manipulation"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">{t.vender_cavalo.back_marketplace}</span>
      </Link>

      <div className="text-center">
        <span className="text-[var(--gold)] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2">
          {t.vender_cavalo.marketplace_title}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic mb-4">
          {t.vender_cavalo.page_title}
        </h1>
        <p className="text-[var(--foreground-secondary)] text-sm max-w-xl mx-auto">
          {t.vender_cavalo.page_desc}
        </p>
      </div>
    </div>
  );
}

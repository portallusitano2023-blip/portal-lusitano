"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

export default function ToolsHero() {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  return (
    <section className="relative pt-28 sm:pt-32 pb-24 sm:pb-28 px-6 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--gold)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[var(--gold)]/3 rounded-full blur-[100px]" />
        {/* Geometric grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-full mb-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <Sparkles size={14} className="text-[var(--gold)]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-medium">
            {t.ferramentas.badge}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[var(--foreground)] mb-6 leading-tight opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          {t.ferramentas.title}{" "}
          <span className="bg-gradient-to-r from-[var(--gold)] to-[#E8D5A3] bg-clip-text text-transparent">
            {t.ferramentas.title_accent}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-[var(--foreground-secondary)] max-w-2xl mx-auto mb-4 font-serif italic opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          {t.ferramentas.subtitle}
        </p>

        <p
          className="text-sm text-[var(--foreground-muted)] max-w-xl mx-auto mb-10 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          {t.ferramentas.subtitle_detail}
        </p>

        {/* Dual CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            href="/analise-perfil"
            className="group inline-flex items-center gap-2.5 px-8 py-4 min-h-[48px] bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black text-sm font-bold rounded-xl hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all hover:shadow-xl hover:shadow-[var(--gold)]/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles size={16} />
            {tr("Começar Agora — Grátis", "Start Now — Free", "Empezar Ahora — Gratis")}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() =>
              document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[48px] border border-[var(--border)] text-[var(--foreground-secondary)] text-sm font-medium rounded-xl hover:border-[var(--gold)]/40 hover:text-[var(--foreground)] transition-all"
          >
            {tr("Ver Planos PRO", "View PRO Plans", "Ver Planes PRO")}
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Trust indicators */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.5s" }}
        >
          {[
            {
              value: tr("4", "4", "4"),
              label: tr(
                "ferramentas profissionais",
                "professional tools",
                "herramientas profesionales"
              ),
            },
            {
              value: tr("~3 min", "~3 min", "~3 min"),
              label: tr("por análise", "per analysis", "por análisis"),
            },
            {
              value: tr("100%", "100%", "100%"),
              label: tr("focado no Lusitano", "Lusitano-focused", "enfocado en el Lusitano"),
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-2xl font-serif text-[var(--gold)]">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-[var(--foreground-muted)] uppercase tracking-wider mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ToolsHero() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--gold)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[var(--gold)]/3 rounded-full blur-[100px]" />
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
          className="text-sm text-[var(--foreground-muted)] max-w-xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          {t.ferramentas.subtitle_detail}
        </p>
      </div>
    </section>
  );
}

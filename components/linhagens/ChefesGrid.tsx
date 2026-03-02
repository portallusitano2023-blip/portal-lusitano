"use client";

import { Crown, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { ChefeLinhagem } from "./types";

interface ChefesGridProps {
  chefes: ChefeLinhagem[];
}

export default function ChefesGrid({ chefes }: ChefesGridProps) {
  const { t } = useLanguage();

  return (
    <RevealOnScroll delay={150}>
      <section className="mb-16">
        <h2 className="text-2xl font-serif text-[var(--foreground)] mb-2 text-center">
          {t.linhagens.heads_title}
        </h2>
        <p className="text-[var(--foreground-muted)] text-sm text-center mb-8">
          {t.linhagens.heads_subtitle}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {chefes.map((chefe) => (
            <div
              key={chefe.nome}
              className={`text-center p-4 border transition-colors ${
                chefe.tipo === "Égua"
                  ? "bg-[var(--gold)]/10 border-[var(--gold)]/30"
                  : "bg-[var(--background-secondary)]/50 border-[var(--border)] hover:border-[var(--gold)]/30"
              }`}
            >
              <div className="w-12 h-12 mx-auto bg-[var(--gold)]/10 rounded-full flex items-center justify-center mb-3">
                {chefe.tipo === "Égua" ? (
                  <Heart className="text-[var(--gold)]" size={20} />
                ) : (
                  <Crown className="text-[var(--gold)]" size={20} />
                )}
              </div>
              <h3 className="text-[var(--foreground)] font-serif text-sm mb-1">{chefe.nome}</h3>
              <p className="text-[var(--foreground-muted)] text-xs">{chefe.ano}</p>
              <p className="text-[var(--gold)] text-xs mt-1">{chefe.marca}</p>
              <p className="text-[var(--foreground-muted)] text-[10px] mt-1 uppercase tracking-wider">
                {chefe.linhagem}
              </p>
            </div>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}

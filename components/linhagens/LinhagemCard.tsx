"use client";

import {
  Calendar,
  MapPin,
  ChevronRight,
  Crown,
  Award,
  Target,
  Shield,
  Landmark,
  Dna,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { Linhagem } from "./types";

const iconMap: Record<string, typeof Shield> = {
  veiga: Target,
  andrade: Award,
  "alter-real": Landmark,
  "coudelaria-nacional": Shield,
};

interface LinhagemCardProps {
  linhagem: Linhagem;
  index: number;
  onSelect: () => void;
}

export default function LinhagemCard({ linhagem, index, onSelect }: LinhagemCardProps) {
  const { t } = useLanguage();
  const Icon = iconMap[linhagem.id] || Dna;

  return (
    <RevealOnScroll delay={index * 100} variant="fade-up">
      <button onClick={onSelect} className="text-left group relative overflow-hidden w-full">
        <div className="relative h-96 bg-gradient-to-br from-[var(--background-secondary)] via-[var(--background-secondary)]/80 to-[var(--gold)]/5">
          <div className="absolute top-8 right-8 opacity-10">
            <Icon size={120} className="text-[var(--gold)]" />
          </div>

          <div className="absolute inset-0 border border-[var(--border)] group-hover:border-[var(--gold)]/50 transition-colors" />

          <div className="absolute top-4 left-4 bg-black/60 text-[var(--gold)] px-3 py-1 text-sm flex items-center gap-2">
            <Calendar size={14} />
            {t.linhagens.since} {linhagem.anoFundacao}
          </div>

          <div className="absolute top-4 right-4 bg-black/60 text-[var(--foreground-secondary)] px-2 py-1 text-[10px] uppercase tracking-wider">
            {linhagem.confianca}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            {linhagem.cabecaLinhagem && (
              <div className="flex items-center gap-2 mb-3">
                <Crown size={14} className="text-[var(--gold)]" />
                <span className="text-xs text-[var(--gold)]">
                  {t.linhagens.lineage_head}: {linhagem.cabecaLinhagem}
                </span>
              </div>
            )}

            <h3 className="text-2xl font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors mb-2">
              {t.linhagens.lineage_prefix} {linhagem.nome}
            </h3>

            <div className="flex items-center gap-2 text-[var(--foreground-secondary)] text-sm mb-3">
              <MapPin size={14} className="text-[var(--gold)]" />
              {linhagem.origem}
            </div>

            <p className="text-[var(--foreground-secondary)] text-sm line-clamp-2 mb-4">
              {linhagem.descricao}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {linhagem.aptidoes.slice(0, 4).map((apt) => (
                <span
                  key={apt}
                  className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] px-2 py-0.5"
                >
                  {apt}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[var(--gold)] text-sm">
              {t.linhagens.explore_lineage}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </button>
    </RevealOnScroll>
  );
}

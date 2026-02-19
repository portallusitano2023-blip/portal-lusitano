"use client";

import { useMemo } from "react";
import { Ruler, Footprints, Heart, Shield, Dna, GraduationCap, Euro } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// ============================================
// TIPOS
// ============================================

interface CategoryRankingCavalo {
  id: string;
  nome: string;
  conformacao: number;
  andamentos: number;
  temperamento: number;
  saude: number;
  blup: number;
  treino: string;
  preco: number;
}

interface CategoryRankingProps {
  cavalos: CategoryRankingCavalo[];
  cores: string[];
}

// ============================================
// HELPERS
// ============================================

const TREINO_MAP: Record<string, number> = {
  Potro: 1,
  Desbravado: 2,
  Iniciado: 3,
  Elementar: 4,
  Medio: 5,
  Médio: 5,
  Avancado: 6,
  Avançado: 6,
  "Alta Escola": 7,
  "Grand Prix": 8,
};

const ICONS = {
  conformacao: Ruler,
  andamentos: Footprints,
  temperamento: Heart,
  saude: Shield,
  blup: Dna,
  treino: GraduationCap,
  preco: Euro,
} as const;

type CategoryKey = keyof typeof ICONS;

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  conformacao: "Conformação",
  andamentos: "Andamentos",
  temperamento: "Temperamento",
  saude: "Saúde",
  blup: "BLUP",
  treino: "Treino",
  preco: "Preço",
};

// ============================================
// COMPONENTE
// ============================================

export default function CategoryRanking({ cavalos, cores }: CategoryRankingProps) {
  const { t } = useLanguage();

  const winners = useMemo(() => {
    const categories: CategoryKey[] = [
      "conformacao",
      "andamentos",
      "temperamento",
      "saude",
      "blup",
      "treino",
      "preco",
    ];

    return categories.map((key) => {
      let bestIdx = 0;

      for (let i = 1; i < cavalos.length; i++) {
        const current = cavalos[i];
        const best = cavalos[bestIdx];

        if (key === "treino") {
          const curLevel = TREINO_MAP[current.treino] ?? 4;
          const bestLevel = TREINO_MAP[best.treino] ?? 4;
          if (curLevel > bestLevel) bestIdx = i;
        } else if (key === "preco") {
          if (current.preco < best.preco) bestIdx = i;
        } else {
          if (current[key] > best[key]) bestIdx = i;
        }
      }

      return { key, winnerIdx: bestIdx, winnerName: cavalos[bestIdx].nome };
    });
  }, [cavalos]);

  const title =
    (t.comparador as Record<string, string>).category_ranking_title ?? "Ranking por Categoria";

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-6 border border-[var(--border)]">
      <h3 className="text-lg font-serif mb-6 text-[var(--foreground)]">{title}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {winners.map(({ key, winnerIdx, winnerName }) => {
          const Icon = ICONS[key];
          const color = cores[winnerIdx] ?? "#C5A059";

          return (
            <div
              key={key}
              className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-4 flex flex-col items-center text-center gap-2"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${color}15` }}
              >
                <Icon size={18} style={{ color }} aria-hidden="true" />
              </div>

              <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
                {CATEGORY_LABELS[key]}
              </span>

              <span
                className="text-sm font-semibold px-2 py-0.5 rounded-full"
                style={{
                  color,
                  background: `${color}15`,
                }}
              >
                {winnerName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

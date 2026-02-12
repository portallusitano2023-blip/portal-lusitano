"use client";

import { memo } from "react";
import { Trophy, Users } from "lucide-react";
import { CavaloFamoso } from "@/app/cavalos-famosos/types";

interface CavaloCardProps {
  cavalo: CavaloFamoso;
  onClick: () => void;
  variant?: "destaque" | "normal";
}

export const CavaloCard = memo(function CavaloCard({
  cavalo,
  onClick,
  variant = "destaque",
}: CavaloCardProps) {
  if (variant === "destaque") {
    return (
      <button
        onClick={onClick}
        className="group bg-gradient-to-b from-[var(--background-secondary)]/80 to-[var(--background-secondary)]/40 border border-[var(--gold)]/20 rounded-2xl overflow-hidden text-left hover:border-[var(--gold)]/50 transition-all touch-manipulation w-full"
      >
        {/* Image Placeholder */}
        <div className="aspect-[4/3] bg-gradient-to-br from-[var(--gold)]/20 to-transparent relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-serif text-[var(--gold)]/30">
              {cavalo.nome.charAt(0)}
            </span>
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 bg-[var(--gold)] rounded text-xs font-medium text-black">
              {cavalo.disciplina}
            </span>
            <span className="px-2 py-1 bg-[var(--background-secondary)]/80 rounded text-xs text-[var(--foreground-secondary)]">
              {cavalo.linhagem}
            </span>
          </div>
          {cavalo.influenciaGenetica && cavalo.influenciaGenetica > 5 && (
            <div className="absolute top-3 right-3 bg-green-500/20 border border-green-500/50 rounded-full px-2 py-1">
              <span className="text-xs text-green-400 font-mono">{cavalo.influenciaGenetica}%</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-xl font-serif text-[var(--foreground)] mb-1 group-hover:text-[var(--gold)] transition-colors">
            {cavalo.nome}
          </h3>
          {cavalo.apelido && (
            <p className="text-sm text-[var(--gold)] italic mb-2">&quot;{cavalo.apelido}&quot;</p>
          )}
          <p className="text-xs text-[var(--foreground-muted)] mb-3">
            {cavalo.anoNascimento} {cavalo.anoFalecimento ? `- ${cavalo.anoFalecimento}` : ""} •{" "}
            {cavalo.coudelaria}
          </p>
          <p className="text-sm text-[var(--foreground-secondary)] line-clamp-2 mb-3">
            {cavalo.legado}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-[var(--gold)]" />
              <span className="text-xs text-[var(--foreground-muted)]">
                {cavalo.conquistas.length} conquistas
              </span>
            </div>
            {cavalo.estatisticasDescendentes && (
              <div className="flex items-center gap-2">
                <Users size={14} className="text-[var(--foreground-muted)]" />
                <span className="text-xs text-[var(--foreground-muted)]">
                  {cavalo.estatisticasDescendentes.totalDescendentes} desc.
                </span>
              </div>
            )}
          </div>
        </div>
      </button>
    );
  }

  // Variante Normal (compact)
  return (
    <button
      onClick={onClick}
      className="group bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-4 text-left hover:border-[var(--gold)]/30 transition-all touch-manipulation w-full"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-[var(--background-card)] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-serif text-[var(--foreground-secondary)]">
            {cavalo.nome.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors truncate">
            {cavalo.nome}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-1">
            {cavalo.anoNascimento} • {cavalo.coudelaria}
          </p>
          <div className="flex gap-1">
            <span className="inline-block px-2 py-0.5 bg-[var(--background-card)] rounded text-xs text-[var(--foreground-secondary)]">
              {cavalo.disciplina}
            </span>
            <span className="inline-block px-2 py-0.5 bg-[var(--background-card)]/50 rounded text-xs text-[var(--foreground-muted)]">
              {cavalo.linhagem}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-[var(--foreground-muted)] mt-3 line-clamp-2">{cavalo.legado}</p>
      {cavalo.influenciaGenetica && (
        <div className="mt-2 text-xs text-[var(--foreground-secondary)]">
          Influência genética:{" "}
          <span className="text-[var(--gold)]">{cavalo.influenciaGenetica}%</span>
        </div>
      )}
    </button>
  );
});

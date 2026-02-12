"use client";

import { Dna, Globe } from "lucide-react";
import { IndiceReproducao as IndiceType } from "@/app/cavalos-famosos/types";

interface IndiceReproducaoProps {
  indice: IndiceType;
  influencia?: number;
}

export function IndiceReproducao({ indice, influencia }: IndiceReproducaoProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-[var(--gold)]";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-[var(--gold)]";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
      <h3 className="flex items-center gap-2 text-[var(--gold)] font-semibold mb-4">
        <Dna size={20} />
        Índice de Reprodução
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Score de Prepotência */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--foreground-muted)]">Prepotência</span>
            <span className={`text-lg font-bold ${getScoreColor(indice.scorePrepotencia)}`}>
              {indice.scorePrepotencia}
            </span>
          </div>
          <div className="h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(indice.scorePrepotencia)} transition-all`}
              style={{ width: `${indice.scorePrepotencia}%` }}
            />
          </div>
        </div>

        {/* Consistência de Tipo */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--foreground-muted)]">Consistência</span>
            <span className={`text-lg font-bold ${getScoreColor(indice.consistenciaTipo)}`}>
              {indice.consistenciaTipo}
            </span>
          </div>
          <div className="h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(indice.consistenciaTipo)} transition-all`}
              style={{ width: `${indice.consistenciaTipo}%` }}
            />
          </div>
        </div>

        {/* Taxa de Aprovação */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--foreground-muted)]">Taxa Aprovação</span>
            <span className="text-lg font-bold text-[var(--foreground)]">
              {indice.taxaAprovacao}%
            </span>
          </div>
          <div className="h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${indice.taxaAprovacao}%` }}
            />
          </div>
        </div>

        {/* BLUP */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--foreground-muted)]">BLUP Estimado</span>
            <span
              className={`text-lg font-bold ${indice.blupEstimado >= 120 ? "text-green-400" : indice.blupEstimado >= 100 ? "text-[var(--gold)]" : "text-[var(--foreground-secondary)]"}`}
            >
              {indice.blupEstimado}
            </span>
          </div>
          <div className="text-xs text-[var(--foreground-muted)]">
            {indice.blupEstimado >= 130
              ? "Excepcional"
              : indice.blupEstimado >= 120
                ? "Excelente"
                : indice.blupEstimado >= 110
                  ? "Muito Bom"
                  : indice.blupEstimado >= 100
                    ? "Bom"
                    : "Média"}
          </div>
        </div>
      </div>

      {/* Influência Genética */}
      {influencia && (
        <div className="bg-gradient-to-r from-[var(--gold)]/20 to-transparent rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <Globe size={24} className="text-[var(--gold)]" />
            <div>
              <div className="text-2xl font-bold text-[var(--foreground)]">{influencia}%</div>
              <div className="text-xs text-[var(--foreground-secondary)]">
                dos Lusitanos atuais descendem deste cavalo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Características Dominantes */}
      <div>
        <h4 className="text-sm text-[var(--foreground-secondary)] mb-2">
          Características Dominantes
        </h4>
        <div className="flex flex-wrap gap-2">
          {indice.caracteristicasDominantes.map((caract, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-[var(--gold)]/20 border border-[var(--gold)]/30 rounded-full text-xs text-[var(--gold)]"
            >
              {caract}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

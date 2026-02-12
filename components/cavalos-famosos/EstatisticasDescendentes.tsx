"use client";

import { Users, Globe, Crown } from "lucide-react";
import { EstatisticasDescendentes as EstatisticasType } from "@/app/cavalos-famosos/types";

interface EstatisticasDescendentesProps {
  stats: EstatisticasType;
}

export function EstatisticasDescendentes({ stats }: EstatisticasDescendentesProps) {
  const taxaSucesso = ((stats.campeoes / stats.totalDescendentes) * 100).toFixed(1);
  const taxaAprovacao = ((stats.descendentesAprovados / stats.totalDescendentes) * 100).toFixed(1);

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
      <h3 className="flex items-center gap-2 text-[var(--gold)] font-semibold mb-4">
        <Users size={20} />
        Estatísticas de Descendentes
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-[var(--foreground)]">
            {stats.totalDescendentes}
          </div>
          <div className="text-xs text-[var(--foreground-muted)]">Total Descendentes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500">{stats.descendentesAprovados}</div>
          <div className="text-xs text-[var(--foreground-muted)]">Aprovados ({taxaAprovacao}%)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[var(--gold)]">{stats.campeoes}</div>
          <div className="text-xs text-[var(--foreground-muted)]">Campeões ({taxaSucesso}%)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.reprodutoresAtivos}</div>
          <div className="text-xs text-[var(--foreground-muted)]">Reprodutores Ativos</div>
        </div>
      </div>

      {/* Distribuição Geográfica */}
      <div className="mb-4">
        <h4 className="text-sm text-[var(--foreground-secondary)] mb-2 flex items-center gap-2">
          <Globe size={14} />
          Distribuição Geográfica
        </h4>
        <div className="flex flex-wrap gap-2">
          {stats.paisesComDescendentes.map((pais, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-[var(--background-card)] rounded text-xs text-[var(--foreground-secondary)]"
            >
              {pais}
            </span>
          ))}
        </div>
      </div>

      {/* Melhores Filhos */}
      {stats.melhoresFilhos.length > 0 && (
        <div>
          <h4 className="text-sm text-[var(--foreground-secondary)] mb-2 flex items-center gap-2">
            <Crown size={14} className="text-[var(--gold)]" />
            Melhores Descendentes
          </h4>
          <div className="space-y-2">
            {stats.melhoresFilhos.map((filho, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-[var(--background-card)]/50 rounded-lg px-3 py-2"
              >
                <span className="text-sm text-[var(--foreground)] font-medium">{filho.nome}</span>
                <span className="text-xs text-[var(--gold)]">{filho.conquista}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

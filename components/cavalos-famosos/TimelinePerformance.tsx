"use client";

import { TrendingUp, Star, Calendar } from "lucide-react";
import { PerformanceAnual } from "@/app/cavalos-famosos/types";

interface TimelinePerformanceProps {
  historico: PerformanceAnual[];
}

export function TimelinePerformance({ historico }: TimelinePerformanceProps) {
  const maxPontuacao = Math.max(
    ...historico.filter((h) => h.pontuacao).map((h) => h.pontuacao || 0)
  );

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
      <h3 className="flex items-center gap-2 text-[var(--gold)] font-semibold mb-4">
        <TrendingUp size={20} />
        Linha do Tempo - Carreira
      </h3>

      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]"></div>

        <div className="space-y-4">
          {historico.map((evento, i) => (
            <div key={i} className="flex items-start gap-4 relative">
              {/* Ponto na linha */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  evento.destaque
                    ? "bg-[var(--gold)] text-black"
                    : "bg-[var(--background-card)] text-[var(--foreground-secondary)]"
                }`}
              >
                {evento.destaque ? <Star size={14} /> : <Calendar size={14} />}
              </div>

              {/* Conteúdo */}
              <div
                className={`flex-1 ${evento.destaque ? "bg-[var(--gold)]/10 border-[var(--gold)]/30" : "bg-[var(--background-card)]/30 border-[var(--border)]"} border rounded-lg p-3`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[var(--foreground)]">{evento.ano}</span>
                  {evento.pontuacao && (
                    <span className="text-sm font-mono text-[var(--gold)]">
                      {evento.pontuacao.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="text-sm text-[var(--foreground-secondary)]">{evento.evento}</div>
                <div
                  className={`text-xs ${evento.destaque ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"}`}
                >
                  {evento.resultado}
                </div>

                {/* Barra de pontuação */}
                {evento.pontuacao && (
                  <div className="mt-2 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--gold)] to-[#D4AF6A] transition-all"
                      style={{ width: `${(evento.pontuacao / maxPontuacao) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

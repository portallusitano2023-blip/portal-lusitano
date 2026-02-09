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
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
      <h3 className="flex items-center gap-2 text-[#C5A059] font-semibold mb-4">
        <TrendingUp size={20} />
        Linha do Tempo - Carreira
      </h3>

      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-700"></div>

        <div className="space-y-4">
          {historico.map((evento, i) => (
            <div key={i} className="flex items-start gap-4 relative">
              {/* Ponto na linha */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  evento.destaque ? "bg-[#C5A059] text-black" : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {evento.destaque ? <Star size={14} /> : <Calendar size={14} />}
              </div>

              {/* Conteúdo */}
              <div
                className={`flex-1 ${evento.destaque ? "bg-[#C5A059]/10 border-[#C5A059]/30" : "bg-zinc-800/30 border-zinc-800"} border rounded-lg p-3`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">{evento.ano}</span>
                  {evento.pontuacao && (
                    <span className="text-sm font-mono text-[#C5A059]">
                      {evento.pontuacao.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="text-sm text-zinc-300">{evento.evento}</div>
                <div className={`text-xs ${evento.destaque ? "text-[#C5A059]" : "text-zinc-500"}`}>
                  {evento.resultado}
                </div>

                {/* Barra de pontuação */}
                {evento.pontuacao && (
                  <div className="mt-2 h-1 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF6A] transition-all"
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

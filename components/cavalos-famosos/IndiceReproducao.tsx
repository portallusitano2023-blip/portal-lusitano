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
    if (score >= 75) return "text-[#C5A059]";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-[#C5A059]";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
      <h3 className="flex items-center gap-2 text-[#C5A059] font-semibold mb-4">
        <Dna size={20} />
        Índice de Reprodução
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Score de Prepotência */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">Prepotência</span>
            <span className={`text-lg font-bold ${getScoreColor(indice.scorePrepotencia)}`}>
              {indice.scorePrepotencia}
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(indice.scorePrepotencia)} transition-all`}
              style={{ width: `${indice.scorePrepotencia}%` }}
            />
          </div>
        </div>

        {/* Consistência de Tipo */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">Consistência</span>
            <span className={`text-lg font-bold ${getScoreColor(indice.consistenciaTipo)}`}>
              {indice.consistenciaTipo}
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(indice.consistenciaTipo)} transition-all`}
              style={{ width: `${indice.consistenciaTipo}%` }}
            />
          </div>
        </div>

        {/* Taxa de Aprovação */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">Taxa Aprovação</span>
            <span className="text-lg font-bold text-white">{indice.taxaAprovacao}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${indice.taxaAprovacao}%` }}
            />
          </div>
        </div>

        {/* BLUP */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">BLUP Estimado</span>
            <span
              className={`text-lg font-bold ${indice.blupEstimado >= 120 ? "text-green-400" : indice.blupEstimado >= 100 ? "text-[#C5A059]" : "text-zinc-400"}`}
            >
              {indice.blupEstimado}
            </span>
          </div>
          <div className="text-xs text-zinc-600">
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
        <div className="bg-gradient-to-r from-[#C5A059]/20 to-transparent rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <Globe size={24} className="text-[#C5A059]" />
            <div>
              <div className="text-2xl font-bold text-white">{influencia}%</div>
              <div className="text-xs text-zinc-400">
                dos Lusitanos atuais descendem deste cavalo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Características Dominantes */}
      <div>
        <h4 className="text-sm text-zinc-400 mb-2">Características Dominantes</h4>
        <div className="flex flex-wrap gap-2">
          {indice.caracteristicasDominantes.map((caract, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-[#C5A059]/20 border border-[#C5A059]/30 rounded-full text-xs text-[#C5A059]"
            >
              {caract}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

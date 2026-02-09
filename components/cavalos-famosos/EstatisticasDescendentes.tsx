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
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
      <h3 className="flex items-center gap-2 text-[#C5A059] font-semibold mb-4">
        <Users size={20} />
        Estatísticas de Descendentes
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{stats.totalDescendentes}</div>
          <div className="text-xs text-zinc-500">Total Descendentes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500">{stats.descendentesAprovados}</div>
          <div className="text-xs text-zinc-500">Aprovados ({taxaAprovacao}%)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#C5A059]">{stats.campeoes}</div>
          <div className="text-xs text-zinc-500">Campeões ({taxaSucesso}%)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.reprodutoresAtivos}</div>
          <div className="text-xs text-zinc-500">Reprodutores Ativos</div>
        </div>
      </div>

      {/* Distribuição Geográfica */}
      <div className="mb-4">
        <h4 className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
          <Globe size={14} />
          Distribuição Geográfica
        </h4>
        <div className="flex flex-wrap gap-2">
          {stats.paisesComDescendentes.map((pais, i) => (
            <span key={i} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
              {pais}
            </span>
          ))}
        </div>
      </div>

      {/* Melhores Filhos */}
      {stats.melhoresFilhos.length > 0 && (
        <div>
          <h4 className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
            <Crown size={14} className="text-[#C5A059]" />
            Melhores Descendentes
          </h4>
          <div className="space-y-2">
            {stats.melhoresFilhos.map((filho, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2"
              >
                <span className="text-sm text-white font-medium">{filho.nome}</span>
                <span className="text-xs text-[#C5A059]">{filho.conquista}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

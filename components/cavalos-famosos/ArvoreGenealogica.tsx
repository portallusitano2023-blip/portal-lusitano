"use client";

import { useState } from "react";
import { GitBranch, ChevronDown, ChevronRight, Star } from "lucide-react";
import { Ancestral, Pedigree } from "@/app/cavalos-famosos/types";

interface ArvoreGenealogicaProps {
  pedigree: Pedigree;
  nomeBase: string;
}

export function ArvoreGenealogica({ pedigree, nomeBase }: ArvoreGenealogicaProps) {
  const [expandido, setExpandido] = useState(true);

  const renderAncestral = (ancestral: Ancestral | undefined, nivel: number, posicao: string) => {
    if (!ancestral) return null;

    const bgColors = [
      "bg-gradient-to-r from-[#C5A059]/30 to-[#C5A059]/10",
      "bg-zinc-800/80",
      "bg-zinc-800/50",
      "bg-zinc-900/50",
    ];

    return (
      <div
        className={`${bgColors[nivel]} border ${ancestral.destaque ? "border-[#C5A059]" : "border-zinc-700"} rounded-lg p-3 min-w-[140px]`}
      >
        <div className="flex items-center gap-2">
          {ancestral.destaque && <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />}
          <span
            className={`text-sm font-medium ${ancestral.destaque ? "text-[#C5A059]" : "text-white"}`}
          >
            {ancestral.nome}
          </span>
        </div>
        {ancestral.ano && <span className="text-xs text-zinc-500 block">{ancestral.ano}</span>}
        {ancestral.coudelaria && (
          <span className="text-xs text-zinc-600 block truncate">{ancestral.coudelaria}</span>
        )}
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider mt-1 block">
          {posicao}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
      <button
        onClick={() => setExpandido(!expandido)}
        className="flex items-center gap-2 text-[#C5A059] mb-4 hover:text-[#D4AF6A] transition-colors"
        aria-label={expandido ? "Colapsar árvore genealógica" : "Expandir árvore genealógica"}
      >
        <GitBranch size={20} />
        <span className="font-semibold">Árvore Genealógica</span>
        {expandido ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {expandido && (
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-col items-center min-w-[600px]">
            {/* Nível 0: Cavalo Principal */}
            <div className="bg-gradient-to-r from-[#C5A059] to-[#8B7355] text-black px-6 py-3 rounded-xl font-bold text-lg shadow-lg mb-4">
              {nomeBase}
            </div>

            {/* Linha de conexão */}
            <div className="w-px h-6 bg-zinc-700"></div>
            <div className="w-64 h-px bg-zinc-700"></div>

            {/* Nível 1: Pais */}
            <div className="flex gap-8 mt-2">
              <div className="flex flex-col items-center">
                {renderAncestral(pedigree.pai, 0, "Pai")}

                {(pedigree.avoPaterno || pedigree.avoaPaterna) && (
                  <>
                    <div className="w-px h-4 bg-zinc-700"></div>
                    <div className="w-32 h-px bg-zinc-700"></div>
                    <div className="flex gap-4 mt-2">
                      {renderAncestral(pedigree.avoPaterno, 1, "Avô Paterno")}
                      {renderAncestral(pedigree.avoaPaterna, 1, "Avó Paterna")}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col items-center">
                {renderAncestral(pedigree.mae, 0, "Mãe")}

                {(pedigree.avoMaterno || pedigree.avoaMaterna) && (
                  <>
                    <div className="w-px h-4 bg-zinc-700"></div>
                    <div className="w-32 h-px bg-zinc-700"></div>
                    <div className="flex gap-4 mt-2">
                      {renderAncestral(pedigree.avoMaterno, 1, "Avô Materno")}
                      {renderAncestral(pedigree.avoaMaterna, 1, "Avó Materna")}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

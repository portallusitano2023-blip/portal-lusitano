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
      "bg-gradient-to-r from-[var(--gold)]/30 to-[var(--gold)]/10",
      "bg-[var(--background-card)]/80",
      "bg-[var(--background-card)]/50",
      "bg-[var(--background-secondary)]/50",
    ];

    return (
      <div
        className={`${bgColors[nivel]} border ${ancestral.destaque ? "border-[var(--gold)]" : "border-[var(--border)]"} rounded-lg p-3 min-w-[140px]`}
      >
        <div className="flex items-center gap-2">
          {ancestral.destaque && (
            <Star size={12} className="text-[var(--gold)] fill-[var(--gold)]" />
          )}
          <span
            className={`text-sm font-medium ${ancestral.destaque ? "text-[var(--gold)]" : "text-[var(--foreground)]"}`}
          >
            {ancestral.nome}
          </span>
        </div>
        {ancestral.ano && (
          <span className="text-xs text-[var(--foreground-muted)] block">{ancestral.ano}</span>
        )}
        {ancestral.coudelaria && (
          <span className="text-xs text-[var(--foreground-muted)] block truncate">
            {ancestral.coudelaria}
          </span>
        )}
        <span className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider mt-1 block">
          {posicao}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
      <button
        onClick={() => setExpandido(!expandido)}
        className="flex items-center gap-2 text-[var(--gold)] mb-4 hover:text-[#D4AF6A] transition-colors"
        aria-label={expandido ? "Colapsar árvore genealógica" : "Expandir árvore genealógica"}
      >
        <GitBranch size={20} />
        <span className="font-semibold">Árvore Genealógica</span>
        {expandido ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {expandido && (
        <div className="relative">
          <div className="overflow-x-auto pb-4">
            <div className="flex flex-col items-center min-w-[480px]">
              {/* Nível 0: Cavalo Principal */}
              <div className="bg-gradient-to-r from-[var(--gold)] to-[#8B7355] text-black px-6 py-3 rounded-xl font-bold text-lg shadow-lg mb-4">
                {nomeBase}
              </div>

              {/* Linha de conexão */}
              <div className="w-px h-6 bg-[var(--border)]"></div>
              <div className="w-64 h-px bg-[var(--border)]"></div>

              {/* Nível 1: Pais */}
              <div className="flex gap-8 mt-2">
                <div className="flex flex-col items-center">
                  {renderAncestral(pedigree.pai, 0, "Pai")}

                  {(pedigree.avoPaterno || pedigree.avoaPaterna) && (
                    <>
                      <div className="w-px h-4 bg-[var(--border)]"></div>
                      <div className="w-32 h-px bg-[var(--border)]"></div>
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
                      <div className="w-px h-4 bg-[var(--border)]"></div>
                      <div className="w-32 h-px bg-[var(--border)]"></div>
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
          {/* Scroll affordance — visible only on small screens */}
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[var(--background-secondary)]/80 to-transparent pointer-events-none sm:hidden" />
          <p className="text-center text-[10px] text-[var(--foreground-muted)] mt-1 sm:hidden">
            ← Deslize para ver a árvore completa →
          </p>
        </div>
      )}
    </div>
  );
}

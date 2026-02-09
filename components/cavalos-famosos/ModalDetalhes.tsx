"use client";

import { X, Award, GitBranch, Users, TrendingUp, Trophy } from "lucide-react";
import { CavaloFamoso } from "@/app/cavalos-famosos/types";
import { ArvoreGenealogica } from "./ArvoreGenealogica";
import { EstatisticasDescendentes } from "./EstatisticasDescendentes";
import { TimelinePerformance } from "./TimelinePerformance";
import { IndiceReproducao } from "./IndiceReproducao";

interface ModalDetalhesProps {
  cavalo: CavaloFamoso;
  onClose: () => void;
  abaAtiva: "info" | "genealogia" | "descendentes" | "performance";
  setAbaAtiva: (aba: "info" | "genealogia" | "descendentes" | "performance") => void;
}

export function ModalDetalhes({ cavalo, onClose, abaAtiva, setAbaAtiva }: ModalDetalhesProps) {
  const abas = [
    { id: "info" as const, label: "Informação", icon: Award },
    { id: "genealogia" as const, label: "Genealogia", icon: GitBranch },
    { id: "descendentes" as const, label: "Descendentes", icon: Users },
    { id: "performance" as const, label: "Performance", icon: TrendingUp },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="aspect-[21/9] bg-gradient-to-br from-[#C5A059]/30 via-zinc-900 to-zinc-900 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[120px] font-serif text-[#C5A059]/15">
              {cavalo.nome.charAt(0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors touch-manipulation"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>

          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-[#C5A059] rounded-full text-sm font-medium text-black">
              {cavalo.disciplina}
            </span>
            <span className="px-3 py-1 bg-zinc-800/90 rounded-full text-sm text-zinc-300">
              Linhagem {cavalo.linhagem}
            </span>
            {cavalo.influenciaGenetica && cavalo.influenciaGenetica > 5 && (
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-sm text-green-400">
                Top Influenciador
              </span>
            )}
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="border-b border-zinc-800 px-6">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  abaAtiva === aba.id
                    ? "border-[#C5A059] text-[#C5A059]"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <aba.icon size={16} />
                {aba.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6 sm:p-8">
          {/* Header comum */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-1">{cavalo.nome}</h2>
            {cavalo.apelido && (
              <p className="text-lg text-[#C5A059] italic">&quot;{cavalo.apelido}&quot;</p>
            )}
          </div>

          {/* Aba: Informação */}
          {abaAtiva === "info" && (
            <div className="space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <span className="text-xs text-zinc-500 block mb-1">Período</span>
                  <span className="text-sm text-white">
                    {cavalo.anoNascimento}
                    {cavalo.anoFalecimento ? ` - ${cavalo.anoFalecimento}` : " - presente"}
                  </span>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <span className="text-xs text-zinc-500 block mb-1">Pelagem</span>
                  <span className="text-sm text-white">{cavalo.pelagem}</span>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <span className="text-xs text-zinc-500 block mb-1">Coudelaria</span>
                  <span className="text-sm text-white">{cavalo.coudelaria}</span>
                </div>
                {cavalo.altura && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <span className="text-xs text-zinc-500 block mb-1">Altura</span>
                    <span className="text-sm text-white">{cavalo.altura} cm</span>
                  </div>
                )}
                {cavalo.cavaleiro && (
                  <div className="bg-zinc-800/50 rounded-lg p-3 col-span-2">
                    <span className="text-xs text-zinc-500 block mb-1">Cavaleiro</span>
                    <span className="text-sm text-white">{cavalo.cavaleiro}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-zinc-300">{cavalo.descricao}</p>

              {/* Conquistas */}
              <div>
                <h3 className="text-sm font-semibold text-[#C5A059] mb-3 flex items-center gap-2">
                  <Trophy size={16} />
                  Principais Conquistas
                </h3>
                <ul className="space-y-2">
                  {cavalo.conquistas.map((conquista, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <Award size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                      {conquista}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curiosidades */}
              {cavalo.curiosidades && cavalo.curiosidades.length > 0 && (
                <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#C5A059] mb-2">Curiosidades</h3>
                  <ul className="space-y-1">
                    {cavalo.curiosidades.map((curiosidade, i) => (
                      <li key={i} className="text-sm text-zinc-400">
                        • {curiosidade}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Índice de Reprodução */}
              {cavalo.indiceReproducao && (
                <IndiceReproducao
                  indice={cavalo.indiceReproducao}
                  influencia={cavalo.influenciaGenetica}
                />
              )}
            </div>
          )}

          {/* Aba: Genealogia */}
          {abaAtiva === "genealogia" && (
            <ArvoreGenealogica pedigree={cavalo.pedigree} nomeBase={cavalo.nome} />
          )}

          {/* Aba: Descendentes */}
          {abaAtiva === "descendentes" &&
            (cavalo.estatisticasDescendentes ? (
              <EstatisticasDescendentes stats={cavalo.estatisticasDescendentes} />
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <Users size={48} className="mx-auto mb-4 opacity-30" />
                <p>Dados de descendentes não disponíveis</p>
              </div>
            ))}

          {/* Aba: Performance */}
          {abaAtiva === "performance" &&
            (cavalo.historicoPerformance ? (
              <TimelinePerformance historico={cavalo.historicoPerformance} />
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
                <p>Histórico de performance não disponível</p>
              </div>
            ))}

          {/* Legado Footer */}
          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-500 italic">&quot;{cavalo.legado}&quot;</p>
          </div>
        </div>
      </div>
    </div>
  );
}

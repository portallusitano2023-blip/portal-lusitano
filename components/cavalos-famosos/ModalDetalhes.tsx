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
        className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="aspect-[21/9] bg-gradient-to-br from-[var(--gold)]/30 via-[var(--background-secondary)] to-[var(--background-secondary)] relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[120px] font-serif text-[var(--gold)]/15">
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
            <span className="px-3 py-1 bg-[var(--gold)] rounded-full text-sm font-medium text-black">
              {cavalo.disciplina}
            </span>
            <span className="px-3 py-1 bg-[var(--background-card)]/90 rounded-full text-sm text-[var(--foreground-secondary)]">
              Linhagem {cavalo.linhagem}
            </span>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="border-b border-[var(--border)] px-6">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  abaAtiva === aba.id
                    ? "border-[var(--gold)] text-[var(--gold)]"
                    : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
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
            <h2 className="text-2xl sm:text-3xl font-serif text-[var(--foreground)] mb-1">
              {cavalo.nome}
            </h2>
            {cavalo.apelido && (
              <p className="text-lg text-[var(--gold)] italic">&quot;{cavalo.apelido}&quot;</p>
            )}
          </div>

          {/* Aba: Informação */}
          {abaAtiva === "info" && (
            <div className="space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--background-card)]/50 rounded-lg p-3">
                  <span className="text-xs text-[var(--foreground-muted)] block mb-1">Período</span>
                  <span className="text-sm text-[var(--foreground)]">
                    {cavalo.anoNascimento}
                    {cavalo.anoFalecimento ? ` - ${cavalo.anoFalecimento}` : " - presente"}
                  </span>
                </div>
                <div className="bg-[var(--background-card)]/50 rounded-lg p-3">
                  <span className="text-xs text-[var(--foreground-muted)] block mb-1">Pelagem</span>
                  <span className="text-sm text-[var(--foreground)]">{cavalo.pelagem}</span>
                </div>
                <div className="bg-[var(--background-card)]/50 rounded-lg p-3">
                  <span className="text-xs text-[var(--foreground-muted)] block mb-1">
                    Coudelaria
                  </span>
                  <span className="text-sm text-[var(--foreground)]">{cavalo.coudelaria}</span>
                </div>
                {cavalo.altura && (
                  <div className="bg-[var(--background-card)]/50 rounded-lg p-3">
                    <span className="text-xs text-[var(--foreground-muted)] block mb-1">
                      Altura
                    </span>
                    <span className="text-sm text-[var(--foreground)]">{cavalo.altura} cm</span>
                  </div>
                )}
                {cavalo.cavaleiro && (
                  <div className="bg-[var(--background-card)]/50 rounded-lg p-3 col-span-2">
                    <span className="text-xs text-[var(--foreground-muted)] block mb-1">
                      Cavaleiro
                    </span>
                    <span className="text-sm text-[var(--foreground)]">{cavalo.cavaleiro}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-[var(--foreground-secondary)]">{cavalo.descricao}</p>

              {/* Conquistas */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--gold)] mb-3 flex items-center gap-2">
                  <Trophy size={16} />
                  Principais Conquistas
                </h3>
                <ul className="space-y-2">
                  {cavalo.conquistas.map((conquista, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]"
                    >
                      <Award size={14} className="text-[var(--gold)] mt-0.5 flex-shrink-0" />
                      {conquista}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curiosidades */}
              {cavalo.curiosidades && cavalo.curiosidades.length > 0 && (
                <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[var(--gold)] mb-2">Curiosidades</h3>
                  <ul className="space-y-1">
                    {cavalo.curiosidades.map((curiosidade, i) => (
                      <li key={i} className="text-sm text-[var(--foreground-secondary)]">
                        • {curiosidade}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Índice de Reprodução */}
              {cavalo.indiceReproducao && <IndiceReproducao indice={cavalo.indiceReproducao} />}
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
              <div className="text-center py-12 text-[var(--foreground-muted)]">
                <Users size={48} className="mx-auto mb-4 opacity-30" />
                <p>Dados de descendentes não disponíveis</p>
              </div>
            ))}

          {/* Aba: Performance */}
          {abaAtiva === "performance" &&
            (cavalo.historicoPerformance ? (
              <TimelinePerformance historico={cavalo.historicoPerformance} />
            ) : (
              <div className="text-center py-12 text-[var(--foreground-muted)]">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
                <p>Histórico de performance não disponível</p>
              </div>
            ))}

          {/* Legado Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-sm text-[var(--foreground-muted)] italic">
              &quot;{cavalo.legado}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

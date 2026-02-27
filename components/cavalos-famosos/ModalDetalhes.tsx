"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
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
  const [imgError, setImgError] = useState(false);
  const hasImage = cavalo.imagem && !imgError;
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const abas = [
    { id: "info" as const, label: "Informação", icon: Award },
    { id: "genealogia" as const, label: "Genealogia", icon: GitBranch },
    { id: "descendentes" as const, label: "Descendentes", icon: Users },
    { id: "performance" as const, label: "Performance", icon: TrendingUp },
  ];

  // Body scroll lock + focus management
  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    // Auto-focus the close button
    const closeBtn = dialogRef.current?.querySelector<HTMLElement>('[aria-label="Fechar modal"]');
    closeBtn?.focus();

    return () => {
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    };
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Tab keyboard navigation (arrow keys)
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = (index + 1) % abas.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = (index - 1 + abas.length) % abas.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = abas.length - 1;
      } else {
        return;
      }
      setAbaAtiva(abas[nextIndex].id);
      // Focus the new tab button
      const tabList = (e.target as HTMLElement).closest('[role="tablist"]');
      const buttons = tabList?.querySelectorAll<HTMLElement>('[role="tab"]');
      buttons?.[nextIndex]?.focus();
    },
    [abas, setAbaAtiva]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-detalhes-title"
    >
      <div
        ref={dialogRef}
        className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="aspect-[21/9] bg-gradient-to-br from-[var(--gold)]/30 via-[var(--background-secondary)] to-[var(--background-secondary)] relative overflow-hidden">
          {hasImage ? (
            <>
              <Image
                src={cavalo.imagem!}
                alt={cavalo.nome}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
                onError={() => setImgError(true)}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
                aria-hidden="true"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="text-[120px] font-serif text-[var(--gold)]/15">
                {cavalo.nome.charAt(0)}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
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

        {/* Tab Navigation */}
        <div className="border-b border-[var(--border)] px-6">
          <div
            className="flex gap-1 -mb-px overflow-x-auto"
            role="tablist"
            aria-label="Detalhes do cavalo"
          >
            {abas.map((aba, i) => (
              <button
                key={aba.id}
                role="tab"
                id={`tab-${aba.id}`}
                aria-selected={abaAtiva === aba.id}
                aria-controls={`tabpanel-${aba.id}`}
                tabIndex={abaAtiva === aba.id ? 0 : -1}
                onClick={() => setAbaAtiva(aba.id)}
                onKeyDown={(e) => handleTabKeyDown(e, i)}
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

        {/* Tab Panel Content */}
        <div
          className="p-6 sm:p-8"
          role="tabpanel"
          id={`tabpanel-${abaAtiva}`}
          aria-labelledby={`tab-${abaAtiva}`}
        >
          {/* Header */}
          <div className="mb-6">
            <h2
              id="modal-detalhes-title"
              className="text-2xl sm:text-3xl font-serif text-[var(--foreground)] mb-1"
            >
              {cavalo.nome}
            </h2>
            {cavalo.apelido && (
              <p className="text-lg text-[var(--gold)] italic">&quot;{cavalo.apelido}&quot;</p>
            )}
          </div>

          {/* Tab: Info */}
          {abaAtiva === "info" && (
            <div className="space-y-6">
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

              <p className="text-[var(--foreground-secondary)]">{cavalo.descricao}</p>

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

              {cavalo.indiceReproducao && <IndiceReproducao indice={cavalo.indiceReproducao} />}
            </div>
          )}

          {/* Tab: Genealogy */}
          {abaAtiva === "genealogia" && (
            <ArvoreGenealogica pedigree={cavalo.pedigree} nomeBase={cavalo.nome} />
          )}

          {/* Tab: Descendants */}
          {abaAtiva === "descendentes" &&
            (cavalo.estatisticasDescendentes ? (
              <EstatisticasDescendentes stats={cavalo.estatisticasDescendentes} />
            ) : (
              <div className="text-center py-12 text-[var(--foreground-muted)]">
                <Users size={48} className="mx-auto mb-4 opacity-30" />
                <p>Dados de descendentes não disponíveis</p>
              </div>
            ))}

          {/* Tab: Performance */}
          {abaAtiva === "performance" &&
            (cavalo.historicoPerformance ? (
              <TimelinePerformance historico={cavalo.historicoPerformance} />
            ) : (
              <div className="text-center py-12 text-[var(--foreground-muted)]">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
                <p>Histórico de performance não disponível</p>
              </div>
            ))}

          {/* Legacy Footer */}
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

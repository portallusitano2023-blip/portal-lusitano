"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useInViewOnce } from "./useInViewOnce";
import type { SeccaoExpandivel } from "./types";

export function SeccaoCard({
  seccao,
  aberta,
  onToggle,
  indice,
  total,
  primeiraFechada,
}: {
  seccao: SeccaoExpandivel;
  aberta: boolean;
  onToggle: () => void;
  indice: number;
  total: number;
  primeiraFechada: boolean;
}) {
  const Icone = seccao.icone;
  const isLast = indice === total - 1;
  const seccaoRef = useRef<HTMLDivElement>(null);
  const prevAberta = useRef(aberta);
  const [hasBeenOpened, setHasBeenOpened] = useState(aberta);
  const inView = useInViewOnce(seccaoRef);

  // Lazy-mount: marcar como aberta via callback (nao em effect)
  const handleToggleWithMount = useCallback(() => {
    if (!hasBeenOpened) setHasBeenOpened(true);
    onToggle();
  }, [hasBeenOpened, onToggle]);

  // Auto-scroll suave para a seccao quando abre
  useEffect(() => {
    if (aberta && !prevAberta.current && seccaoRef.current) {
      const timer = setTimeout(() => {
        seccaoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return () => clearTimeout(timer);
    }
    prevAberta.current = aberta;
  }, [aberta]);

  return (
    <div
      ref={seccaoRef}
      className={`relative flex gap-4 sm:gap-6 scroll-mt-24 transition-all duration-500 ease-out ${
        inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
      }`}
      style={{ transitionDelay: `${indice * 60}ms` }}
    >
      {/* Timeline - linha e marcador */}
      <div className="flex flex-col items-center flex-shrink-0">
        <button
          onClick={handleToggleWithMount}
          className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center touch-manipulation transition-all duration-200 hover:scale-110 active:scale-90 ${
            aberta
              ? "bg-[var(--gold)] shadow-[0_0_20px_rgba(197,160,89,0.3)]"
              : "bg-[var(--background-secondary)] border-2 border-[var(--border)] hover:border-[var(--gold)]/50 group"
          }`}
          aria-label={`Expandir ${seccao.titulo}`}
        >
          <Icone
            size={16}
            className={`transition-colors duration-150 ${aberta ? "text-black" : "text-[var(--foreground-muted)] group-hover:text-[var(--gold)]"}`}
          />
          {primeiraFechada && (
            <span className="absolute inset-0 rounded-full border-2 border-[var(--gold)]/40 animate-ping" />
          )}
        </button>
        {/* Linha vertical - CSS transition nativa */}
        {!isLast && (
          <div
            className={`w-[2px] flex-1 origin-top transition-all duration-500 ease-out ${
              inView ? "scale-y-100" : "scale-y-0"
            } ${aberta ? "bg-gradient-to-b from-[var(--gold)]/40 to-[var(--border)]/40" : "bg-[var(--border)]/60"}`}
            style={{ transitionDelay: `${indice * 60 + 150}ms` }}
          />
        )}
      </div>

      {/* Conteudo da seccao */}
      <div className="flex-1 pb-8 sm:pb-10">
        <button
          onClick={handleToggleWithMount}
          className="w-full text-left group touch-manipulation transition-transform duration-200 hover:translate-x-1"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                className={`text-[15px] sm:text-xl font-serif leading-tight transition-colors duration-150 ${aberta ? "text-[var(--gold)]" : "text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)]"}`}
              >
                {seccao.titulo}
              </h2>
              <p
                className={`text-[11px] sm:text-[13px] mt-1 transition-colors duration-150 ${aberta ? "text-[var(--foreground-secondary)]" : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground-muted)]"}`}
              >
                {seccao.subtitulo}
              </p>
              {!aberta && (
                <span
                  className={`inline-flex items-center gap-1.5 mt-2.5 text-[11px] sm:text-xs font-medium transition-colors duration-150 ${primeiraFechada ? "text-[var(--gold)]" : "text-[var(--foreground-muted)] group-hover:text-[var(--gold)]"}`}
                >
                  Toque para ler
                  <span
                    className={
                      primeiraFechada
                        ? "inline-block animate-[gentle-bounce_1s_ease-in-out_infinite]"
                        : ""
                    }
                  >
                    <ChevronDown size={12} />
                  </span>
                </span>
              )}
            </div>
            {aberta && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] text-[var(--gold)]/60 mt-1">
                Fechar
                <ChevronDown size={12} className="rotate-180" />
              </span>
            )}
          </div>
        </button>

        {/* Conteudo expandido - CSS grid-rows (GPU composited, zero layout thrashing) */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: aberta ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {hasBeenOpened && (
              <div
                className={`mt-5 sm:mt-6 bg-[var(--background-secondary)]/50 border border-[var(--border)]/60 rounded-xl p-5 sm:p-7 transition-opacity duration-200 ${aberta ? "opacity-100" : "opacity-0"}`}
              >
                {seccao.conteudo}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

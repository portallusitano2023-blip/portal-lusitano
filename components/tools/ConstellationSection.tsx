"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import LusitanoConstellation from "./LusitanoConstellation";
import { type ConstellationHorse } from "./constellation-data";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { usePrefersReducedMotion, useIsMobile } from "@/hooks";
import { useLanguage } from "@/context/LanguageContext";

type Phase = "hidden" | "stars" | "lines" | "labels" | "complete";

const SESSION_KEY = "constellation-animated";

export default function ConstellationSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(sectionRef as React.RefObject<HTMLElement>);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [selectedHorse, setSelectedHorse] = useState<ConstellationHorse | null>(null);

  // Phase machine
  useEffect(() => {
    if (!inView) return;

    // Skip animation if already seen or reduced motion
    const alreadySeen =
      typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";

    if (reducedMotion || alreadySeen) {
       
      queueMicrotask(() => setPhase("complete"));
      return;
    }

    // Cinematic sequence
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("stars"), 500));
    timers.push(setTimeout(() => setPhase("lines"), 2000));
    timers.push(setTimeout(() => setPhase("labels"), 3000));
    timers.push(
      setTimeout(() => {
        setPhase("complete");
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // sessionStorage unavailable
        }
      }, 3500)
    );

    return () => timers.forEach(clearTimeout);
  }, [inView, reducedMotion]);

  const handleHorseClick = useCallback((horse: ConstellationHorse) => {
    setSelectedHorse(horse);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedHorse(null);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!selectedHorse) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedHorse, handleClose]);

  const ft = t.ferramentas as Record<string, string>;

  return (
    <section ref={sectionRef} className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header
          className="text-center mb-10 transition-opacity duration-700"
          style={{ opacity: phase === "hidden" ? 0 : 1 }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] block mb-4">
            {ft.constellation_badge || "Constelacao Lusitana"}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
            {ft.constellation_title || "As Estrelas da Raca"}
          </h2>
          <p className="text-[var(--foreground-secondary)] max-w-lg mx-auto">
            {ft.constellation_subtitle ||
              "Explore os 15 cavalos que definiram a historia do Lusitano e as suas ligacoes geneticas"}
          </p>
        </header>

        {/* SVG Container */}
        <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]/50 overflow-hidden">
          {/* Noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="p-4 md:p-8">
            <LusitanoConstellation phase={phase} onHorseClick={handleHorseClick} />
          </div>

          {/* Desktop Detail Card */}
          {selectedHorse && !isMobile && (
            <div
              role="dialog"
              aria-label={selectedHorse.nome}
              className="absolute top-8 right-8 w-80 bg-[var(--background)]/95 border border-[var(--gold)]/20 rounded-xl p-6 shadow-2xl backdrop-blur-md z-40 animate-in fade-in slide-in-from-right-4 duration-300"
            >
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>

              <DetailContent horse={selectedHorse} ft={ft} />
            </div>
          )}
        </div>

        {/* Legend */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-[var(--foreground-muted)] transition-opacity duration-500"
          style={{ opacity: phase === "complete" ? 1 : 0 }}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-sm">♕</span>
            {ft.constellation_founder || "Chefe de Linhagem"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-6 h-px bg-[var(--gold)]/50 inline-block" />
            {ft.constellation_connection || "Ligacao pai-filho"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] inline-block" />
            Veiga
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8B7355] inline-block" />
            Andrade
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A0522D] inline-block" />
            Alter Real
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6B8E6B] inline-block" />
            C. Nacional
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7B98B0] inline-block" />
            Lusitano
          </span>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {selectedHorse && isMobile && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />
          <div
            role="dialog"
            aria-label={selectedHorse.nome}
            className="fixed inset-x-0 bottom-0 z-50 bg-[var(--background)] border-t border-[var(--gold)]/20 rounded-t-2xl p-6 shadow-2xl max-h-[70vh] overflow-y-auto"
            style={{
              animation: "constellationSlideUp 0.3s ease-out",
            }}
          >
            <div className="w-10 h-1 bg-[var(--border)] rounded-full mx-auto mb-4" />
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>

            <DetailContent horse={selectedHorse} ft={ft} />
          </div>
        </>
      )}
    </section>
  );
}

function DetailContent({ horse, ft }: { horse: ConstellationHorse; ft: Record<string, string> }) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-serif text-[var(--gold)] mb-1">{horse.nome}</h3>
        {horse.apelido && (
          <p className="text-xs text-[var(--foreground-secondary)] italic">{horse.apelido}</p>
        )}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--foreground-muted)]">
            {ft.constellation_years || "Periodo"}
          </span>
          <span className="text-[var(--foreground)]">{horse.anos}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--foreground-muted)]">
            {ft.constellation_lineage || "Linhagem"}
          </span>
          <span className="text-[var(--foreground)]">{horse.linhagem}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--foreground-muted)]">
            {ft.constellation_discipline || "Disciplina"}
          </span>
          <span className="text-[var(--foreground)] text-right max-w-[180px]">
            {horse.disciplina}
          </span>
        </div>
        {horse.pai && (
          <div className="flex justify-between">
            <span className="text-[var(--foreground-muted)]">{ft.constellation_sire || "Pai"}</span>
            <span className="text-[var(--foreground)]">{horse.pai}</span>
          </div>
        )}

        {horse.isFounder && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded-full">
              ♕ {ft.constellation_founder || "Chefe de Linhagem"}
            </span>
          </div>
        )}

        <div className="border-t border-[var(--border)] pt-3 mt-3">
          <p className="text-[var(--foreground-muted)] text-xs mb-2">
            {ft.constellation_achievements || "Conquistas"}
          </p>
          <ul className="space-y-1.5">
            {horse.conquistas.map((c, i) => (
              <li
                key={i}
                className="text-xs text-[var(--foreground-secondary)] flex items-start gap-1.5"
              >
                <span className="text-[var(--gold)] mt-0.5 flex-shrink-0">·</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

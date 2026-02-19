"use client";

import Link from "next/link";
import { Calculator, ArrowLeft, RefreshCw, Pencil } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CalculadoraHeaderProps {
  step: number;
  totalSteps: number;
  progress: number;
  hasResultado: boolean;
  onReset: () => void;
  onEdit?: () => void;
  estimativaParcial?: { min: number; max: number } | null;
}

export default function CalculadoraHeader({
  step,
  totalSteps,
  progress,
  hasResultado,
  onReset,
  onEdit,
  estimativaParcial,
}: CalculadoraHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--background-secondary)]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium hidden sm:block">Portal Lusitano</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--gold)] to-[#8B7355] flex items-center justify-center">
            <Calculator size={18} className="text-black" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-medium text-[var(--foreground)] block leading-tight">
              {t.calculadora.tool_name}
            </span>
            <span className="text-xs text-[var(--foreground-muted)]">
              {t.calculadora.tool_subtitle}
            </span>
          </div>
        </div>

        {hasResultado ? (
          <div className="flex items-center gap-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5"
              >
                <Pencil size={13} />
                <span className="hidden sm:inline">Editar</span>
              </button>
            )}
            <button
              onClick={onReset}
              className="text-sm text-[var(--gold)] hover:text-[#D4AF6A] transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">{t.calculadora.new_evaluation}</span>
            </button>
          </div>
        ) : step > 1 && estimativaParcial ? (
          <div className="text-right">
            <p className="text-[10px] text-[var(--foreground-muted)] leading-tight">
              Estimativa parcial
            </p>
            <p className="text-xs font-semibold text-[var(--gold)] leading-tight">
              €{estimativaParcial.min.toLocaleString("pt-PT")} – €
              {estimativaParcial.max.toLocaleString("pt-PT")}
            </p>
          </div>
        ) : step > 0 ? (
          <div className="text-xs text-[var(--foreground-muted)] flex items-center gap-2">
            <span className="text-[var(--gold)]">{step}</span>
            <span>/</span>
            <span>{totalSteps}</span>
          </div>
        ) : (
          <div className="w-20" />
        )}
      </div>

      {/* Progress bar */}
      {step > 0 && !hasResultado && (
        <div className="h-0.5 bg-[var(--background-secondary)]/60">
          <div
            className="h-full bg-gradient-to-r from-[var(--gold)]/70 to-[var(--gold)] transition-all duration-500 ease-out shadow-sm shadow-[var(--gold)]/30"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  );
}

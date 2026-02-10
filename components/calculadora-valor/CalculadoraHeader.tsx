"use client";

import Link from "next/link";
import { Calculator, ArrowLeft, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CalculadoraHeaderProps {
  step: number;
  totalSteps: number;
  progress: number;
  hasResultado: boolean;
  onReset: () => void;
}

export default function CalculadoraHeader({
  step,
  totalSteps,
  progress,
  hasResultado,
  onReset,
}: CalculadoraHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-900">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium hidden sm:block">Portal Lusitano</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C5A059] to-[#8B7355] flex items-center justify-center">
            <Calculator size={18} className="text-black" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-medium text-white block leading-tight">
              {t.calculadora.tool_name}
            </span>
            <span className="text-xs text-zinc-500">{t.calculadora.tool_subtitle}</span>
          </div>
        </div>

        {hasResultado ? (
          <button
            onClick={onReset}
            className="text-sm text-[#C5A059] hover:text-[#D4AF6A] transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">{t.calculadora.new_evaluation}</span>
          </button>
        ) : step > 0 ? (
          <div className="text-xs text-zinc-500 flex items-center gap-2">
            <span className="text-[#C5A059]">{step}</span>
            <span>/</span>
            <span>{totalSteps}</span>
          </div>
        ) : (
          <div className="w-20" />
        )}
      </div>

      {/* Progress bar */}
      {step > 0 && !hasResultado && (
        <div className="h-0.5 bg-zinc-900">
          <div
            className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF6A] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  );
}

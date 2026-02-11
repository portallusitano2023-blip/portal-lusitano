"use client";

import { Calculator, ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface StepNavigationProps {
  step: number;
  totalSteps: number;
  isCalculating: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCalculate: () => void;
}

export default function StepNavigation({
  step,
  totalSteps,
  isCalculating,
  onPrevious,
  onNext,
  onCalculate,
}: StepNavigationProps) {
  const { t } = useLanguage();

  return (
    <div className="flex gap-3 pt-6">
      {step > 1 && (
        <button
          onClick={onPrevious}
          className="flex-1 py-4 rounded-xl border border-zinc-800 text-zinc-400 font-medium hover:border-zinc-700 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft size={18} />
          {t.calculadora.btn_previous}
        </button>
      )}

      {step < totalSteps ? (
        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2"
        >
          {t.calculadora.btn_continue}
          <ChevronRight size={18} />
        </button>
      ) : (
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-bold hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isCalculating ? (
            <>
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              {t.calculadora.btn_processing}
            </>
          ) : (
            <>
              <Calculator size={18} />
              {t.calculadora.btn_calculate}
            </>
          )}
        </button>
      )}
    </div>
  );
}

"use client";

import { TOTAL_STEPS } from "@/components/vender-cavalo/data";

interface FormNavigationProps {
  step: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function FormNavigation({ step, onPrev, onNext }: FormNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-6">
      {step > 1 ? (
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors touch-manipulation"
        >
          Anterior
        </button>
      ) : (
        <div />
      )}

      {step < TOTAL_STEPS && (
        <button
          onClick={onNext}
          className="px-6 py-3 bg-[#C5A059] text-black font-medium rounded-lg hover:bg-[#D4AF6A] transition-colors touch-manipulation"
        >
          Continuar
        </button>
      )}
    </div>
  );
}

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
          className="px-6 py-3 bg-[var(--background-card)] text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors touch-manipulation"
        >
          Anterior
        </button>
      ) : (
        <div />
      )}

      {step < TOTAL_STEPS && (
        <button
          onClick={onNext}
          className="px-6 py-3 bg-[var(--gold)] text-black font-medium rounded-lg hover:bg-[var(--gold-hover)] transition-colors touch-manipulation"
        >
          Continuar
        </button>
      )}
    </div>
  );
}

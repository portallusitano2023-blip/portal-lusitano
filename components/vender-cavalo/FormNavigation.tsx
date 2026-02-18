"use client";

import { TOTAL_STEPS } from "@/components/vender-cavalo/data";
import { useLanguage } from "@/context/LanguageContext";

interface FormNavigationProps {
  step: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function FormNavigation({ step, onPrev, onNext }: FormNavigationProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mt-6">
      {step > 1 ? (
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-[var(--background-card)] text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors touch-manipulation"
        >
          {t.vender_cavalo.previous}
        </button>
      ) : (
        <div />
      )}

      {step < TOTAL_STEPS && (
        <button
          onClick={onNext}
          className="px-6 py-3 bg-[var(--gold)] text-black font-medium rounded-lg hover:bg-[var(--gold-hover)] transition-colors touch-manipulation"
        >
          {t.vender_cavalo.continue}
        </button>
      )}
    </div>
  );
}

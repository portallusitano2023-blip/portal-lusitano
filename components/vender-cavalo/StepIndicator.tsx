"use client";

import { CheckCircle } from "lucide-react";
import { TOTAL_STEPS } from "@/components/vender-cavalo/data";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              s === currentStep
                ? "bg-[var(--gold)] text-black"
                : s < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-[var(--background-card)] text-[var(--foreground-muted)]"
            }`}
          >
            {s < currentStep ? <CheckCircle size={16} /> : s}
          </div>
          {s < TOTAL_STEPS && (
            <div
              className={`w-8 h-0.5 ${s < currentStep ? "bg-green-500" : "bg-[var(--background-card)]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

import { BarChart3, Check } from "lucide-react";

interface ProcessingOverlayProps {
  step: number;
}

export default function ProcessingOverlay({ step }: ProcessingOverlayProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-8 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-[#C5A059]/15" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C5A059] animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#C5A059]/50 animate-[spin_1.5s_linear_infinite_reverse]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BarChart3 size={22} className="text-[#C5A059]" />
        </div>
      </div>

      {/* Main text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-[var(--foreground)] mb-1">
          A comparar os seus cavalos
          <span className="inline-flex gap-0.5 ml-0.5" aria-hidden="true">
            <span className="inline-block animate-[pulse-opacity_1.2s_ease-in-out_0s_infinite]">
              .
            </span>
            <span className="inline-block animate-[pulse-opacity_1.2s_ease-in-out_0.4s_infinite]">
              .
            </span>
            <span className="inline-block animate-[pulse-opacity_1.2s_ease-in-out_0.8s_infinite]">
              .
            </span>
          </span>
        </p>
        <p className="text-sm text-[var(--foreground-muted)]">Isto demora apenas um momento</p>
      </div>

      {/* Animated steps */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {["Analisando pontuações...", "Calculando diferenças...", "Gerando relatório..."].map(
          (label, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                step > idx
                  ? "border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059]"
                  : step === idx
                    ? "border-[#C5A059]/30 bg-[#C5A059]/5 text-[var(--foreground-secondary)]"
                    : "border-[var(--border)]/40 bg-transparent text-[var(--foreground-muted)]"
              }`}
            >
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                {step > idx ? (
                  <Check size={14} className="text-[#C5A059]" />
                ) : step === idx ? (
                  <div className="w-3 h-3 rounded-full border-2 border-[#C5A059]/60 border-t-[#C5A059] animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
                )}
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

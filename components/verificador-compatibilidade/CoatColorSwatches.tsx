"use client";

interface CoatColorSwatchesProps {
  pelagens: { cor: string; prob: number; genetica: string }[];
}

const COAT_GRADIENTS: Record<string, string> = {
  Ruço: "linear-gradient(135deg, #d4d4d4, #9ca3af)",
  "Castanho/Baio": "linear-gradient(135deg, #92400e, #78350f)",
  Castanho: "linear-gradient(135deg, #92400e, #78350f)",
  Baio: "linear-gradient(135deg, #d97706, #b45309)",
  Preto: "linear-gradient(135deg, #27272a, #18181b)",
  Alazão: "linear-gradient(135deg, #c2410c, #9a3412)",
  Palomino: "linear-gradient(135deg, #fbbf24, #d97706)",
  Cremello: "linear-gradient(135deg, #fef3c7, #fde68a)",
  Perlino: "linear-gradient(135deg, #fef9c3, #fde68a)",
  Buckskin: "linear-gradient(135deg, #ca8a04, #a16207)",
  "Smoky Black": "linear-gradient(135deg, #3f3f46, #27272a)",
  "Smoky Cream": "linear-gradient(135deg, #a8a29e, #78716c)",
  Isabelo: "linear-gradient(135deg, #fbbf24, #d97706)",
  "Alazão Dun": "linear-gradient(135deg, #dc6720, #b45309)",
  "Baio Dun": "linear-gradient(135deg, #ca8a04, #92400e)",
  Grullo: "linear-gradient(135deg, #71717a, #52525b)",
};

export default function CoatColorSwatches({ pelagens }: CoatColorSwatchesProps) {
  if (pelagens.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {pelagens.map((p, i) => {
        const gradient = COAT_GRADIENTS[p.cor] ?? "linear-gradient(135deg, #71717a, #52525b)";
        const needsBorder = p.cor === "Preto" || p.cor === "Smoky Black";

        return (
          <div
            key={i}
            className="bg-[var(--background-card)]/50 rounded-lg p-4 flex flex-col items-center gap-2.5 opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {/* Color swatch circle */}
            <div
              className={`w-12 h-12 rounded-full shadow-lg ${needsBorder ? "ring-1 ring-white/10" : ""}`}
              style={{ background: gradient }}
              title={p.cor}
            />
            {/* Coat name and probability */}
            <div className="text-center">
              <span className="text-sm font-medium text-[var(--foreground-secondary)] block">
                {p.cor}
              </span>
              <span className="text-lg font-bold text-purple-400">{p.prob}%</span>
            </div>
            {/* Probability bar */}
            <div className="w-full h-1.5 bg-[var(--background-card)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                style={{ width: `${p.prob}%` }}
              />
            </div>
            {/* Genetic notation */}
            <span className="text-[10px] text-[var(--foreground-muted)] font-mono">
              {p.genetica}
            </span>
          </div>
        );
      })}
    </div>
  );
}

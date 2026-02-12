"use client";

import { ContadorAnimado } from "./ContadorAnimado";

export function DadoDestaque({
  icone: Icone,
  valor,
  label,
  cor = "text-[var(--gold)]",
}: {
  icone: React.ElementType;
  valor: string;
  label: string;
  cor?: string;
}) {
  return (
    <div className="bg-[var(--background-card)]/40 rounded-xl p-4 sm:p-5 text-center border border-[var(--border)]/30 transition-all duration-200 hover:scale-[1.03] hover:border-[var(--gold)]/30">
      <Icone size={18} className={`${cor} mx-auto mb-2`} />
      <ContadorAnimado valor={valor} cor={cor} />
      <div className="text-[10px] sm:text-[11px] text-[var(--foreground-muted)] mt-1 leading-tight">
        {label}
      </div>
    </div>
  );
}

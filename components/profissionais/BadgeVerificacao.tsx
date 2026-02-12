import type { NivelVerificacao, NivelExpertise } from "./types";
import { VERIFICACAO_CONFIG, EXPERTISE_CONFIG } from "./constants";

export function BadgeVerificacao({ nivel }: { nivel: NivelVerificacao }) {
  const config = VERIFICACAO_CONFIG[nivel];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 ${config.bg} rounded-full`}>
      <Icon size={12} className={config.cor} />
      <span className={`text-xs font-medium ${config.cor}`}>{config.label}</span>
    </span>
  );
}

export function BarraExpertise({ nivel }: { nivel: NivelExpertise }) {
  const config = EXPERTISE_CONFIG[nivel];
  const niveis: NivelExpertise[] = ["iniciante", "intermedio", "avancado", "especialista"];
  const index = niveis.indexOf(nivel);
  return (
    <div className="flex gap-1">
      {niveis.map((n, i) => (
        <div
          key={n}
          className={`h-1.5 w-4 rounded-full ${i <= index ? config.cor : "bg-[var(--border)]"}`}
        />
      ))}
    </div>
  );
}

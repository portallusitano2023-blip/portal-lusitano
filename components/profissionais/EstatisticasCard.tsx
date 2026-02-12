import { Users, Star, CheckCircle, BadgeCheck } from "lucide-react";
import type { EstatisticasComunidade } from "./types";

export function EstatisticasCard({ stats }: { stats: EstatisticasComunidade }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-gradient-to-br from-[var(--gold)]/20 to-[var(--background-secondary)] border border-[var(--gold)]/20 rounded-xl p-4 text-center">
        <Users className="w-6 h-6 text-[var(--gold)] mx-auto mb-2" />
        <div className="text-2xl font-bold text-[var(--foreground)]">
          {stats.totalProfissionais}
        </div>
        <div className="text-xs text-[var(--foreground-secondary)]">Profissionais</div>
      </div>
      <div className="bg-gradient-to-br from-purple-500/20 to-[var(--background-secondary)] border border-purple-500/20 rounded-xl p-4 text-center">
        <BadgeCheck className="w-6 h-6 text-purple-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-[var(--foreground)]">
          {stats.profissionaisVerificados}
        </div>
        <div className="text-xs text-[var(--foreground-secondary)]">Verificados</div>
      </div>
      <div className="bg-gradient-to-br from-blue-500/20 to-[var(--background-secondary)] border border-blue-500/20 rounded-xl p-4 text-center">
        <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-[var(--foreground)]">{stats.mediaAvaliacoes}</div>
        <div className="text-xs text-[var(--foreground-secondary)]">Avaliação Média</div>
      </div>
      <div className="bg-gradient-to-br from-green-500/20 to-[var(--background-secondary)] border border-green-500/20 rounded-xl p-4 text-center">
        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-[var(--foreground)]">
          {stats.casosResolvidos.toLocaleString()}
        </div>
        <div className="text-xs text-[var(--foreground-secondary)]">Casos/Ano</div>
      </div>
    </div>
  );
}

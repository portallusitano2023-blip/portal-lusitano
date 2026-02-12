import { Clock, ThumbsUp, CheckCircle, Users } from "lucide-react";
import type { MetricasPerformance } from "./types";

export function MetricasPanel({ metricas }: { metricas: MetricasPerformance }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-[var(--background-card)]/50 rounded-lg p-3 text-center">
        <Clock size={16} className="text-[var(--gold)] mx-auto mb-1" />
        <div className="text-sm font-medium text-[var(--foreground)]">{metricas.tempoResposta}</div>
        <div className="text-xs text-[var(--foreground-muted)]">Resposta</div>
      </div>
      <div className="bg-[var(--background-card)]/50 rounded-lg p-3 text-center">
        <ThumbsUp size={16} className="text-green-400 mx-auto mb-1" />
        <div className="text-sm font-medium text-[var(--foreground)]">
          {metricas.taxaSatisfacao}%
        </div>
        <div className="text-xs text-[var(--foreground-muted)]">Satisfação</div>
      </div>
      <div className="bg-[var(--background-card)]/50 rounded-lg p-3 text-center">
        <CheckCircle size={16} className="text-blue-400 mx-auto mb-1" />
        <div className="text-sm font-medium text-[var(--foreground)]">
          {metricas.casosConcluidosAno}
        </div>
        <div className="text-xs text-[var(--foreground-muted)]">Casos/Ano</div>
      </div>
      <div className="bg-[var(--background-card)]/50 rounded-lg p-3 text-center">
        <Users size={16} className="text-purple-400 mx-auto mb-1" />
        <div className="text-sm font-medium text-[var(--foreground)]">
          {metricas.clientesRecorrentes}%
        </div>
        <div className="text-xs text-[var(--foreground-muted)]">Recorrentes</div>
      </div>
    </div>
  );
}

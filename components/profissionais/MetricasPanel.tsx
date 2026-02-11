import { Clock, ThumbsUp, CheckCircle, Users } from "lucide-react";
import type { MetricasPerformance } from "./types";

export function MetricasPanel({ metricas }: { metricas: MetricasPerformance }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
        <Clock size={16} className="text-[#C5A059] mx-auto mb-1" />
        <div className="text-sm font-medium text-white">{metricas.tempoResposta}</div>
        <div className="text-xs text-zinc-500">Resposta</div>
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
        <ThumbsUp size={16} className="text-green-400 mx-auto mb-1" />
        <div className="text-sm font-medium text-white">{metricas.taxaSatisfacao}%</div>
        <div className="text-xs text-zinc-500">Satisfação</div>
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
        <CheckCircle size={16} className="text-blue-400 mx-auto mb-1" />
        <div className="text-sm font-medium text-white">{metricas.casosConcluidosAno}</div>
        <div className="text-xs text-zinc-500">Casos/Ano</div>
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
        <Users size={16} className="text-purple-400 mx-auto mb-1" />
        <div className="text-sm font-medium text-white">{metricas.clientesRecorrentes}%</div>
        <div className="text-xs text-zinc-500">Recorrentes</div>
      </div>
    </div>
  );
}

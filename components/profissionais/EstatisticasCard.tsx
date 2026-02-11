import { Users, Star, CheckCircle, BadgeCheck } from "lucide-react";
import type { EstatisticasComunidade } from "./types";

export function EstatisticasCard({ stats }: { stats: EstatisticasComunidade }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-gradient-to-br from-[#C5A059]/20 to-zinc-900 border border-[#C5A059]/20 rounded-xl p-4 text-center">
        <Users className="w-6 h-6 text-[#C5A059] mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{stats.totalProfissionais}</div>
        <div className="text-xs text-zinc-400">Profissionais</div>
      </div>
      <div className="bg-gradient-to-br from-purple-500/20 to-zinc-900 border border-purple-500/20 rounded-xl p-4 text-center">
        <BadgeCheck className="w-6 h-6 text-purple-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{stats.profissionaisVerificados}</div>
        <div className="text-xs text-zinc-400">Verificados</div>
      </div>
      <div className="bg-gradient-to-br from-blue-500/20 to-zinc-900 border border-blue-500/20 rounded-xl p-4 text-center">
        <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{stats.mediaAvaliacoes}</div>
        <div className="text-xs text-zinc-400">Avaliação Média</div>
      </div>
      <div className="bg-gradient-to-br from-green-500/20 to-zinc-900 border border-green-500/20 rounded-xl p-4 text-center">
        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">
          {stats.casosResolvidos.toLocaleString()}
        </div>
        <div className="text-xs text-zinc-400">Casos/Ano</div>
      </div>
    </div>
  );
}

import { MapPin, Star, Phone, Sparkles, Siren, ChevronRight } from "lucide-react";
import { BadgeVerificacao } from "./BadgeVerificacao";
import type { Profissional } from "./types";

export function CardProfissional({ prof, onClick }: { prof: Profissional; onClick: () => void }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#C5A059]/30 transition-all group">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-[#C5A059]/30 to-zinc-800 rounded-xl flex items-center justify-center text-xl font-serif text-[#C5A059]">
              {prof.nome.charAt(0)}
            </div>
            {prof.disponivel && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-white truncate text-sm">{prof.nome}</h3>
              {prof.destaque && <Sparkles size={12} className="text-[#C5A059]" />}
            </div>
            <p className="text-xs text-[#C5A059] truncate">{prof.especialidade}</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={10} className="text-zinc-500" />
              <span className="text-xs text-zinc-400">{prof.localizacao}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <BadgeVerificacao nivel={prof.nivelVerificacao} />
          <div className="flex items-center gap-1">
            <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />
            <span className="text-xs font-medium text-white">{prof.avaliacao}</span>
            <span className="text-xs text-zinc-500">({prof.numAvaliacoes})</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-zinc-800/30 rounded px-2 py-1.5 text-center">
            <div className="text-xs text-[#C5A059] font-medium">
              {prof.metricas.taxaSatisfacao}%
            </div>
            <div className="text-[10px] text-zinc-500">Satisfação</div>
          </div>
          <div className="bg-zinc-800/30 rounded px-2 py-1.5 text-center">
            <div className="text-xs text-zinc-300 font-medium">{prof.experienciaAnos} anos</div>
            <div className="text-[10px] text-zinc-500">Experiência</div>
          </div>
        </div>

        {prof.disponibilidade.emergencias24h && (
          <div className="mt-2 flex items-center gap-1 text-xs text-red-400">
            <Siren size={10} />
            <span>Emergências 24h</span>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 p-3 flex gap-2">
        <button
          onClick={onClick}
          className="flex-1 py-2 bg-[#C5A059] rounded-lg text-xs text-black font-medium hover:bg-[#D4AF6A] transition-colors flex items-center justify-center gap-1"
        >
          Ver Perfil <ChevronRight size={14} />
        </button>
        <a
          href={`tel:${prof.telefone}`}
          className="p-2 bg-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors"
        >
          <Phone size={14} />
        </a>
      </div>
    </div>
  );
}

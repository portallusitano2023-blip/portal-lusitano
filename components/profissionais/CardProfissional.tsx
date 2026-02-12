import { MapPin, Star, Phone, Sparkles, Siren, ChevronRight } from "lucide-react";
import { BadgeVerificacao } from "./BadgeVerificacao";
import type { Profissional } from "./types";

export function CardProfissional({ prof, onClick }: { prof: Profissional; onClick: () => void }) {
  return (
    <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--gold)]/30 transition-all group">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--gold)]/30 to-[var(--background-card)] rounded-xl flex items-center justify-center text-xl font-serif text-[var(--gold)]">
              {prof.nome.charAt(0)}
            </div>
            {prof.disponivel && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[var(--background-secondary)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-[var(--foreground)] truncate text-sm">
                {prof.nome}
              </h3>
              {prof.destaque && <Sparkles size={12} className="text-[var(--gold)]" />}
            </div>
            <p className="text-xs text-[var(--gold)] truncate">{prof.especialidade}</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={10} className="text-[var(--foreground-muted)]" />
              <span className="text-xs text-[var(--foreground-secondary)]">{prof.localizacao}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <BadgeVerificacao nivel={prof.nivelVerificacao} />
          <div className="flex items-center gap-1">
            <Star size={12} className="text-[var(--gold)] fill-[var(--gold)]" />
            <span className="text-xs font-medium text-[var(--foreground)]">{prof.avaliacao}</span>
            <span className="text-xs text-[var(--foreground-muted)]">({prof.numAvaliacoes})</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-[var(--background-card)]/30 rounded px-2 py-1.5 text-center">
            <div className="text-xs text-[var(--gold)] font-medium">
              {prof.metricas.taxaSatisfacao}%
            </div>
            <div className="text-[10px] text-[var(--foreground-muted)]">Satisfação</div>
          </div>
          <div className="bg-[var(--background-card)]/30 rounded px-2 py-1.5 text-center">
            <div className="text-xs text-[var(--foreground-secondary)] font-medium">
              {prof.experienciaAnos} anos
            </div>
            <div className="text-[10px] text-[var(--foreground-muted)]">Experiência</div>
          </div>
        </div>

        {prof.disponibilidade.emergencias24h && (
          <div className="mt-2 flex items-center gap-1 text-xs text-red-400">
            <Siren size={10} />
            <span>Emergências 24h</span>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border)] p-3 flex gap-2">
        <button
          onClick={onClick}
          className="flex-1 py-2 bg-[var(--gold)] rounded-lg text-xs text-black font-medium hover:bg-[#D4AF6A] transition-colors flex items-center justify-center gap-1"
        >
          Ver Perfil <ChevronRight size={14} />
        </button>
        <a
          href={`tel:${prof.telefone}`}
          className="p-2 bg-[var(--background-card)] rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
        >
          <Phone size={14} />
        </a>
      </div>
    </div>
  );
}

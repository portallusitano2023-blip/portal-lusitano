import Image from "next/image";
import { MapPin, Star, Phone, Sparkles, Siren, ArrowRight, Globe, Plane } from "lucide-react";
import { BadgeVerificacao } from "./BadgeVerificacao";
import { categorias } from "./constants";
import type { Profissional } from "./types";

// Iniciais a partir do nome completo (máx 2 letras)
function getInitials(nome: string): string {
  const parts = nome.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function CardProfissional({ prof, onClick }: { prof: Profissional; onClick: () => void }) {
  // Encontrar o ícone da categoria a partir das constantes
  const categoriaConfig = categorias.find((c) => c.id === prof.categoria);
  const CategoriaIcon = categoriaConfig?.icon;
  const categoriaLabel = categoriaConfig?.label || prof.categoria;

  return (
    <div className="card-premium group relative rounded-xl overflow-hidden border border-[var(--border)] hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-[0_4px_32px_rgba(197,160,89,0.10)] bg-[var(--background-card)]">
      {/* Linha dourada decorativa no topo — aparece no hover */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[var(--gold)]/0 to-transparent group-hover:via-[var(--gold)]/60 transition-all duration-500" />

      <div className="p-5">
        {/* Header: avatar + nome + badge categoria */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {prof.fotoUrl ? (
              <Image
                src={prof.fotoUrl}
                alt={prof.nome}
                width={56}
                height={56}
                className="w-14 h-14 rounded-xl object-cover"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--gold)]/20 to-[var(--background-elevated)] rounded-xl flex items-center justify-center text-lg font-serif font-medium text-[var(--gold)] select-none">
                {getInitials(prof.nome)}
              </div>
            )}
            {/* Indicador disponível */}
            {prof.disponivel && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[var(--background-card)]" />
            )}
          </div>

          {/* Nome + especialidade + localização */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-semibold text-[var(--foreground)] truncate text-sm leading-tight">
                {prof.nome}
              </h3>
              {prof.destaque && <Sparkles size={11} className="text-[var(--gold)] flex-shrink-0" />}
            </div>

            {/* Categoria badge com ícone */}
            <div className="flex items-center gap-1.5 mb-1.5">
              {CategoriaIcon && (
                <CategoriaIcon size={11} className="text-[var(--gold)]/70 flex-shrink-0" />
              )}
              <span className="text-[10px] text-[var(--gold)] font-medium uppercase tracking-wide truncate">
                {categoriaLabel}
              </span>
            </div>

            {/* Localização / modalidade */}
            {prof.modalidade === "online" ? (
              <div className="flex items-center gap-1">
                <Globe size={10} className="text-blue-400 flex-shrink-0" />
                <span className="text-[11px] text-blue-400 truncate">
                  Online{prof.pais ? ` — ${prof.pais}` : ""}
                </span>
              </div>
            ) : prof.modalidade === "clinicas_internacionais" ? (
              <div className="flex items-center gap-1">
                <Plane size={10} className="text-purple-400 flex-shrink-0" />
                <span className="text-[11px] text-purple-400">Internacional</span>
              </div>
            ) : prof.localizacao ? (
              <div className="flex items-center gap-1">
                <MapPin size={10} className="text-[var(--foreground-muted)] flex-shrink-0" />
                <span className="text-[11px] text-[var(--foreground-secondary)] truncate">
                  {prof.localizacao}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Verificação + rating */}
        <div className="flex items-center justify-between mb-4">
          <BadgeVerificacao nivel={prof.nivelVerificacao} />
          {prof.avaliacao > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5" aria-label={`${prof.avaliacao} de 5 estrelas`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={10}
                    className={
                      s <= Math.round(prof.avaliacao)
                        ? "text-[var(--gold)] fill-[var(--gold)]"
                        : "text-[var(--foreground-muted)]"
                    }
                  />
                ))}
              </div>
              <span className="text-[11px] font-medium text-[var(--foreground)]">
                {prof.avaliacao}
              </span>
              {prof.numAvaliacoes > 0 && (
                <span className="text-[10px] text-[var(--foreground-muted)]">
                  ({prof.numAvaliacoes})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Métricas: satisfação + experiência */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-[var(--background-secondary)]/60 rounded-lg px-3 py-2 text-center">
            <div className="text-xs font-semibold text-[var(--gold)]">
              {prof.metricas.taxaSatisfacao > 0 ? `${prof.metricas.taxaSatisfacao}%` : "—"}
            </div>
            <div className="text-[9px] text-[var(--foreground-muted)] uppercase tracking-wide mt-0.5">
              Satisfação
            </div>
          </div>
          <div className="bg-[var(--background-secondary)]/60 rounded-lg px-3 py-2 text-center">
            <div className="text-xs font-semibold text-[var(--foreground-secondary)]">
              {prof.experienciaAnos > 0 ? `${prof.experienciaAnos} anos` : "—"}
            </div>
            <div className="text-[9px] text-[var(--foreground-muted)] uppercase tracking-wide mt-0.5">
              Experiência
            </div>
          </div>
        </div>

        {/* Tags de serviços */}
        {prof.servicos.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {prof.servicos.slice(0, 3).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 text-[9px] rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 text-[var(--gold)] truncate max-w-[120px]"
                title={s}
              >
                {s}
              </span>
            ))}
            {prof.servicos.length > 3 && (
              <span className="px-2 py-0.5 text-[9px] rounded-full border border-[var(--border)] text-[var(--foreground-muted)]">
                +{prof.servicos.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Emergências 24h */}
        {prof.disponibilidade.emergencias24h && (
          <div className="flex items-center gap-1 text-[11px] text-red-400 mb-1">
            <Siren size={10} />
            <span>Emergências 24h</span>
          </div>
        )}
      </div>

      {/* Footer do card: CTA + telefone */}
      <div className="border-t border-[var(--border)] p-3 flex gap-2 bg-[var(--background-secondary)]/30">
        <button
          onClick={onClick}
          className="flex-1 py-2.5 bg-[var(--gold)] rounded-lg text-xs text-black font-semibold hover:bg-[var(--gold-hover)] transition-colors flex items-center justify-center gap-1.5 group-hover:shadow-[0_2px_16px_rgba(197,160,89,0.25)]"
          aria-label={`Ver perfil de ${prof.nome}`}
        >
          Ver Perfil
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </button>
        {prof.telefone && (
          <a
            href={`tel:${prof.telefone}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2.5 bg-[var(--background-secondary)] rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--gold)] transition-all"
            aria-label={`Ligar para ${prof.nome}`}
          >
            <Phone size={14} />
          </a>
        )}
      </div>
    </div>
  );
}

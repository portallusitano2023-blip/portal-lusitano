"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import {
  Calendar,
  MapPin,
  Clock,
  Euro,
  ChevronLeft,
  ChevronRight,
  Tag,
  ExternalLink,
  Star,
  CheckCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Evento {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  descricao_completa?: string;
  tipo: string;
  data_inicio: string;
  data_fim?: string;
  hora_inicio?: string;
  hora_fim?: string;
  localizacao: string;
  regiao?: string;
  organizador?: string;
  website?: string;
  preco_entrada?: string;
  imagem_capa?: string;
  tags?: string[];
  destaque: boolean;
  confirmado?: "confirmado" | "anual" | "provisorio";
}

// ─── Constants ───────────────────────────────────────────────────────────────

const tiposEvento = [
  { value: "todos", label: "Todos os Eventos", icon: "🎪" },
  { value: "feira", label: "Feiras", icon: "🎠" },
  { value: "competicao", label: "Competições", icon: "🏆" },
  { value: "leilao", label: "Leilões", icon: "🔨" },
  { value: "exposicao", label: "Exposições", icon: "🎨" },
  { value: "workshop", label: "Workshops", icon: "📚" },
];

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const ITENS_POR_PAGINA = 12;

// ─── Main ────────────────────────────────────────────────────────────────────

export default function EventosContent({ eventos }: { eventos: Evento[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { t } = useLanguage();

  const [selectedTipo, setSelectedTipo] = useState("todos");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

  const tiposEventoTranslated = useMemo(
    () => [
      { value: "todos", label: t.eventos.all_types, icon: "🎪" },
      { value: "feira", label: t.eventos.fairs, icon: "🎠" },
      { value: "competicao", label: t.eventos.competitions, icon: "🏆" },
      { value: "leilao", label: t.eventos.auctions, icon: "🔨" },
      { value: "exposicao", label: t.eventos.exhibitions, icon: "🎨" },
      { value: "workshop", label: t.eventos.workshops, icon: "📚" },
    ],
    [t]
  );

  // Client-side filter by type (replaces server-side fetch on tipo change)
  const filteredEventos = useMemo(() => {
    if (selectedTipo === "todos") return eventos;
    return eventos.filter((e) => e.tipo === selectedTipo);
  }, [eventos, selectedTipo]);

  // Eventos em destaque
  const eventosDestaque = filteredEventos.filter((e) => e.destaque);

  // Eventos não destaque (para paginação)
  const eventosNormais = filteredEventos.filter((e) => !e.destaque);

  // Ordenar por data descendente (mais recentes primeiro)
  const eventosOrdenados = [...eventosNormais].sort(
    (a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime()
  );

  // Paginação
  const totalPaginas = Math.ceil(eventosOrdenados.length / ITENS_POR_PAGINA);
  const inicio = (currentPage - 1) * ITENS_POR_PAGINA;
  const eventosPaginados = eventosOrdenados.slice(inicio, inicio + ITENS_POR_PAGINA);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Agrupar eventos por mês
  const _eventosPorMes = filteredEventos.reduce(
    (acc, evento) => {
      const date = new Date(evento.data_inicio);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(evento);
      return acc;
    },
    {} as Record<string, Evento[]>
  );

  const _currentMonthKey = `${currentYear}-${currentMonth}`;

  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  function formatDateRange(start: string, end?: string) {
    const startDate = new Date(start);
    if (!end || start === end) {
      return startDate.toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString("pt-PT", { day: "numeric" })} - ${endDate.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })}`;
  }

  function getTipoColor(tipo: string) {
    const colors: Record<string, string> = {
      feira: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      competicao: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      leilao: "bg-green-500/20 text-green-400 border-green-500/30",
      exposicao: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      workshop: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    };
    return (
      colors[tipo] ||
      "bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)] border-[var(--foreground-muted)]/30"
    );
  }

  function getTipoIcon(tipo: string) {
    return tiposEvento.find((t) => t.value === tipo)?.icon || "📅";
  }

  function getConfirmacaoBadge(confirmado?: string) {
    switch (confirmado) {
      case "confirmado":
        return {
          icon: CheckCircle,
          label: t.eventos.confirmed,
          color: "text-green-400",
          bg: "bg-green-500/10",
        };
      case "anual":
        return {
          icon: RefreshCw,
          label: t.eventos.annual,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
        };
      case "provisorio":
        return {
          icon: AlertCircle,
          label: t.eventos.provisional,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
        };
      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold)]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] block mb-4">
              {t.eventos.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--foreground)] mb-6">
              {t.eventos.title}
            </h1>
            <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto text-lg">
              {t.eventos.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Eventos em Destaque */}
        {eventosDestaque.length > 0 && (
          <section
            className="mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Star className="text-[var(--gold)]" size={24} />
              <h2 className="text-2xl font-serif text-[var(--foreground)]">{t.eventos.featured}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {eventosDestaque.slice(0, 2).map((evento, index) => (
                <EventoDestaqueCard
                  key={evento.id}
                  evento={evento}
                  index={index}
                  onClick={() => setSelectedEvento(evento)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Filtros */}
        <div
          className="mb-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-wrap gap-3 mb-6">
            {tiposEventoTranslated.map((tipo) => (
              <button
                key={tipo.value}
                onClick={() => setSelectedTipo(tipo.value)}
                className={`flex items-center gap-2 px-4 py-2 border transition-all ${
                  selectedTipo === tipo.value
                    ? "bg-[var(--gold)] text-black border-[var(--gold)]"
                    : "bg-[var(--background-secondary)]/50 text-[var(--foreground-secondary)] border-[var(--border)] hover:border-[var(--gold)]/50"
                }`}
                aria-pressed={selectedTipo === tipo.value}
              >
                <span>{tipo.icon}</span>
                <span className="text-sm">{tipo.label}</span>
              </button>
            ))}
          </div>

          {/* Navegação do Mês */}
          <div className="flex items-center justify-between bg-[var(--background-secondary)]/50 border border-[var(--border)] p-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
              aria-label={t.eventos.badge ? "Mes anterior" : "Previous month"}
            >
              <ChevronLeft size={24} />
            </button>
            <h3 className="text-xl font-serif text-[var(--foreground)]">
              {meses[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
              aria-label={t.eventos.badge ? "Proximo mes" : "Next month"}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Lista de Eventos */}
        {filteredEventos.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="mx-auto text-[var(--foreground-secondary)] mb-4" size={48} />
            <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">
              {t.eventos.no_events}
            </h3>
            <p className="text-[var(--foreground-muted)]">{t.eventos.no_events_hint}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-[var(--foreground)]">
                {t.eventos.all_events}
                <span className="text-[var(--foreground-secondary)] text-lg ml-3">
                  ({eventosOrdenados.length}{" "}
                  {eventosOrdenados.length === 1 ? t.eventos.event_single : t.eventos.event_plural})
                </span>
              </h2>
            </div>
            <div
              className="space-y-4 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: "0.3s" }}
            >
              {eventosPaginados.map((evento, index) => (
                <EventoCard
                  key={evento.id}
                  evento={evento}
                  index={index}
                  onClick={() => setSelectedEvento(evento)}
                />
              ))}
            </div>

            {/* Paginação */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPaginas}
              onPageChange={handlePageChange}
              className="mt-12"
            />
          </>
        )}

        {/* Modal de Evento */}
        {selectedEvento && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 overflow-y-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            onClick={() => setSelectedEvento(null)}
          >
            <div
              className="bg-[var(--background-secondary)] border border-[var(--border)] max-w-2xl w-full p-8 relative my-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: "0.1s" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEvento(null)}
                className="absolute top-4 right-4 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] text-2xl"
                aria-label="Fechar detalhes do evento"
              >
                ×
              </button>

              <div className="flex items-center flex-wrap gap-3 mb-4">
                <span className="text-3xl">{getTipoIcon(selectedEvento.tipo)}</span>
                <span
                  className={`px-3 py-1 text-xs uppercase tracking-wider border ${getTipoColor(selectedEvento.tipo)}`}
                >
                  {selectedEvento.tipo}
                </span>
                {selectedEvento.destaque && (
                  <span className="flex items-center gap-1 text-[var(--gold)] text-sm">
                    <Star size={14} /> {t.eventos.highlight}
                  </span>
                )}
                {(() => {
                  const badge = getConfirmacaoBadge(selectedEvento.confirmado);
                  if (!badge) return null;
                  const Icon = badge.icon;
                  return (
                    <span
                      className={`flex items-center gap-1 ${badge.color} text-sm ${badge.bg} px-2 py-1 rounded`}
                    >
                      <Icon size={14} /> {badge.label}
                    </span>
                  );
                })()}
              </div>

              <h3 className="text-2xl font-serif text-[var(--foreground)] mb-4">
                {selectedEvento.titulo}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
                  <Calendar size={18} className="text-[var(--gold)]" />
                  <span>
                    {formatDateRange(selectedEvento.data_inicio, selectedEvento.data_fim)}
                  </span>
                </div>
                {selectedEvento.hora_inicio && (
                  <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
                    <Clock size={18} className="text-[var(--gold)]" />
                    <span>
                      {selectedEvento.hora_inicio}
                      {selectedEvento.hora_fim && ` - ${selectedEvento.hora_fim}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
                  <MapPin size={18} className="text-[var(--gold)]" />
                  <span>{selectedEvento.localizacao}</span>
                </div>
                {selectedEvento.preco_entrada && (
                  <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
                    <Euro size={18} className="text-[var(--gold)]" />
                    <span>{selectedEvento.preco_entrada}</span>
                  </div>
                )}
              </div>

              {selectedEvento.organizador && (
                <p className="text-[var(--foreground-muted)] text-sm mb-4">
                  {t.eventos.organized_by}: {selectedEvento.organizador}
                </p>
              )}

              <p className="text-[var(--foreground)] mb-6">
                {selectedEvento.descricao_completa || selectedEvento.descricao}
              </p>

              {selectedEvento.tags && selectedEvento.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedEvento.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs bg-[var(--background-elevated)] text-[var(--foreground-secondary)] px-2 py-1"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Link
                  href={`/eventos/${selectedEvento.slug}`}
                  className="flex items-center justify-center gap-2 w-full bg-[var(--gold)] text-black py-3 font-bold uppercase tracking-wider hover:bg-[var(--gold-hover)] transition-colors"
                >
                  {t.eventos.view_full_page}
                </Link>
                {selectedEvento.website && (
                  <a
                    href={selectedEvento.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[var(--background-elevated)] text-[var(--foreground)] py-3 font-medium hover:bg-[var(--surface-hover)] transition-colors border border-[var(--border)]"
                  >
                    <ExternalLink size={18} />
                    {t.eventos.official_site}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function EventoDestaqueCard({
  evento,
  index,
  onClick,
}: {
  evento: Evento;
  index: number;
  onClick: () => void;
}) {
  const tipoIcon = tiposEvento.find((t) => t.value === evento.tipo)?.icon || "📅";

  return (
    <button
      onClick={onClick}
      className="text-left relative h-64 overflow-hidden group opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {evento.imagem_capa && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={evento.imagem_capa}
          alt={evento.titulo}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 border border-[var(--gold)]/30 group-hover:border-[var(--gold)] transition-colors" />

      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="text-2xl">{tipoIcon}</span>
        <span className="bg-[var(--gold)] text-black px-2 py-1 text-xs font-bold uppercase">
          {evento.tipo}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-2 text-[var(--gold)] text-sm mb-2">
          <Calendar size={14} />
          {new Date(evento.data_inicio).toLocaleDateString("pt-PT", {
            day: "numeric",
            month: "long",
          })}
        </div>
        <h3 className="text-xl font-serif text-white group-hover:text-[var(--gold)] transition-colors mb-2">
          {evento.titulo}
        </h3>
        <div className="flex items-center gap-2 text-[var(--foreground-secondary)] text-sm">
          <MapPin size={14} />
          {evento.localizacao}
        </div>
      </div>
    </button>
  );
}

function EventoCard({
  evento,
  index,
  onClick,
}: {
  evento: Evento;
  index: number;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  const tipoIcon = tiposEvento.find((t) => t.value === evento.tipo)?.icon || "📅";
  const date = new Date(evento.data_inicio);

  function getTipoColor(tipo: string) {
    const colors: Record<string, string> = {
      feira: "bg-amber-500/20 text-amber-400",
      competicao: "bg-blue-500/20 text-blue-400",
      leilao: "bg-green-500/20 text-green-400",
      exposicao: "bg-purple-500/20 text-purple-400",
      workshop: "bg-pink-500/20 text-pink-400",
    };
    return colors[tipo] || "bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)]";
  }

  function getConfirmacaoIcon(confirmado?: string) {
    switch (confirmado) {
      case "confirmado":
        return (
          <span title={t.eventos.confirmed}>
            <CheckCircle size={12} className="text-green-400" />
          </span>
        );
      case "anual":
        return (
          <span title={t.eventos.annual}>
            <RefreshCw size={12} className="text-blue-400" />
          </span>
        );
      case "provisorio":
        return (
          <span title={t.eventos.provisional}>
            <AlertCircle size={12} className="text-amber-400" />
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-stretch bg-[var(--background-secondary)]/50 border border-[var(--border)] hover:border-[var(--gold)]/50 transition-all group opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Data */}
      <div className="w-24 flex-shrink-0 bg-[var(--background-elevated)]/50 flex flex-col items-center justify-center p-4 border-r border-[var(--border)] relative">
        <span className="text-3xl font-serif text-[var(--gold)]">{date.getDate()}</span>
        <span className="text-xs uppercase text-[var(--foreground-muted)]">
          {date.toLocaleDateString("pt-PT", { month: "short" })}
        </span>
        {evento.confirmado === "provisorio" && (
          <span className="absolute top-2 right-2">{getConfirmacaoIcon(evento.confirmado)}</span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-xs ${getTipoColor(evento.tipo)}`}>
            {tipoIcon} {evento.tipo}
          </span>
          {evento.destaque && <Star size={14} className="text-[var(--gold)]" />}
          {evento.confirmado &&
            evento.confirmado !== "provisorio" &&
            getConfirmacaoIcon(evento.confirmado)}
        </div>
        <h3 className="text-lg font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors mb-1">
          {evento.titulo}
        </h3>
        <div className="flex items-center gap-4 text-[var(--foreground-muted)] text-sm">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {evento.localizacao}
          </span>
          {evento.preco_entrada && (
            <span className="flex items-center gap-1">
              <Euro size={14} />
              {evento.preco_entrada}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center px-4 text-[var(--foreground-secondary)] group-hover:text-[var(--gold)] transition-colors">
        <ChevronRight size={24} />
      </div>
    </button>
  );
}

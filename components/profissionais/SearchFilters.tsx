import { Search, X, MapPin, ShieldCheck } from "lucide-react";
import { distritos } from "./constants";
import type { NivelVerificacao } from "./types";
import { useLanguage } from "@/context/LanguageContext";

interface SearchFiltersProps {
  pesquisa: string;
  onPesquisaChange: (value: string) => void;
  distritoAtivo: string;
  onDistritoChange: (value: string) => void;
  filtroVerificacao: NivelVerificacao | "todos";
  onVerificacaoChange: (value: NivelVerificacao | "todos") => void;
  totalResultados: number;
}

export function SearchFilters({
  pesquisa,
  onPesquisaChange,
  distritoAtivo,
  onDistritoChange,
  filtroVerificacao,
  onVerificacaoChange,
  totalResultados,
}: SearchFiltersProps) {
  const { language } = useLanguage();

  const searchPlaceholder =
    language === "pt"
      ? "Pesquisar profissional, especialidade ou serviço..."
      : language === "es"
        ? "Buscar profesional, especialidad o servicio..."
        : "Search professional, specialty or service...";

  const allDistrictLabel =
    language === "pt"
      ? "Todos os distritos"
      : language === "es"
        ? "Todos los distritos"
        : "All districts";

  const allLevelsLabel =
    language === "pt" ? "Todos os níveis" : language === "es" ? "Todos los niveles" : "All levels";

  const resultsLabel =
    language === "pt"
      ? `${totalResultados} profissiona${totalResultados !== 1 ? "is" : "l"} encontrado${totalResultados !== 1 ? "s" : ""}`
      : language === "es"
        ? `${totalResultados} profesional${totalResultados !== 1 ? "es" : ""} encontrado${totalResultados !== 1 ? "s" : ""}`
        : `${totalResultados} professional${totalResultados !== 1 ? "s" : ""} found`;

  const verificacaoOptions: { value: NivelVerificacao | "todos"; label: string }[] = [
    { value: "todos", label: allLevelsLabel },
    {
      value: "expert",
      label: language === "pt" ? "Expert" : language === "es" ? "Experto" : "Expert",
    },
    {
      value: "certificado",
      label: language === "pt" ? "Certificado" : language === "es" ? "Certificado" : "Certified",
    },
    {
      value: "verificado",
      label: language === "pt" ? "Verificado" : language === "es" ? "Verificado" : "Verified",
    },
  ];

  const hasFilters = pesquisa || distritoAtivo !== "Todos" || filtroVerificacao !== "todos";

  return (
    <div className="space-y-3">
      {/* Linha 1: pesquisa + selects */}
      <div className="flex flex-wrap gap-3">
        {/* Input de pesquisa */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
          />
          <input
            type="text"
            value={pesquisa}
            onChange={(e) => onPesquisaChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg pl-9 pr-9 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
          />
          {pesquisa && (
            <button
              onClick={() => onPesquisaChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              aria-label={
                language === "pt"
                  ? "Limpar pesquisa"
                  : language === "es"
                    ? "Borrar búsqueda"
                    : "Clear search"
              }
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Select distrito — com ícone */}
        <div className="relative">
          <MapPin
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
          />
          <select
            value={distritoAtivo}
            onChange={(e) => onDistritoChange(e.target.value)}
            className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg pl-8 pr-8 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors appearance-none cursor-pointer"
            aria-label={
              language === "pt"
                ? "Filtrar por distrito"
                : language === "es"
                  ? "Filtrar por distrito"
                  : "Filter by district"
            }
          >
            {distritos.map((d) => (
              <option key={d} value={d} className="bg-[var(--background-secondary)]">
                {d === "Todos" ? allDistrictLabel : d}
              </option>
            ))}
          </select>
          {/* Chevron */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="currentColor"
              className="text-[var(--foreground-muted)]"
            >
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Select nível verificação — com ícone */}
        <div className="relative">
          <ShieldCheck
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
          />
          <select
            value={filtroVerificacao}
            onChange={(e) => onVerificacaoChange(e.target.value as NivelVerificacao | "todos")}
            className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg pl-8 pr-8 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors appearance-none cursor-pointer"
            aria-label={
              language === "pt"
                ? "Filtrar por verificação"
                : language === "es"
                  ? "Filtrar por verificación"
                  : "Filter by verification"
            }
          >
            {verificacaoOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[var(--background-secondary)]"
              >
                {opt.label}
              </option>
            ))}
          </select>
          {/* Chevron */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="currentColor"
              className="text-[var(--foreground-muted)]"
            >
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Linha 2: contagem + botão limpar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--foreground-muted)]">{resultsLabel}</span>
        {hasFilters && (
          <button
            onClick={() => {
              onPesquisaChange("");
              onDistritoChange("Todos");
              onVerificacaoChange("todos");
            }}
            className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] hover:text-red-400 border border-transparent hover:border-red-400/30 rounded px-2 py-0.5 transition-all"
          >
            <X size={10} />
            {language === "pt"
              ? "Limpar filtros"
              : language === "es"
                ? "Borrar filtros"
                : "Clear filters"}
          </button>
        )}
      </div>
    </div>
  );
}

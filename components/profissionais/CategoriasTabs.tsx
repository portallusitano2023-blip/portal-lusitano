import { categorias } from "./constants";
import type { CategoriaProf } from "./types";
import { useLanguage } from "@/context/LanguageContext";

interface CategoriasTabsProps {
  categoriaAtiva: CategoriaProf | "todos";
  onCategoriaChange: (id: CategoriaProf | "todos") => void;
}

export function CategoriasTabs({ categoriaAtiva, onCategoriaChange }: CategoriasTabsProps) {
  const { language } = useLanguage();

  // Etiquetas trilingues para as categorias principais
  const labelMap: Record<string, { pt: string; en: string; es: string }> = {
    todos: { pt: "Todos", en: "All", es: "Todos" },
    veterinario: { pt: "Veterinários", en: "Veterinarians", es: "Veterinarios" },
    ferrador: { pt: "Ferradores", en: "Farriers", es: "Herradores" },
    treinador: { pt: "Treinadores", en: "Trainers", es: "Entrenadores" },
    dentista: { pt: "Dentistas Equinos", en: "Equine Dentists", es: "Dentistas Equinos" },
    quiropratico: { pt: "Quiropráticos", en: "Chiropractors", es: "Quiroprácticos" },
    nutricionista: { pt: "Nutricionistas", en: "Nutritionists", es: "Nutricionistas" },
    inseminador: { pt: "Inseminadores", en: "Inseminators", es: "Inseminadores" },
    fotografo: { pt: "Fotógrafos", en: "Photographers", es: "Fotógrafos" },
    transportador: { pt: "Transportadores", en: "Transporters", es: "Transportadores" },
    juiz: { pt: "Juízes", en: "Judges", es: "Jueces" },
    instrutor: { pt: "Instrutores", en: "Instructors", es: "Instructores" },
    seleiro: { pt: "Seleiros", en: "Saddlers", es: "Talabarteros" },
    tosquiador: { pt: "Tosquiadores", en: "Groomers", es: "Esquiladores" },
    massagista: { pt: "Massagistas", en: "Masseurs", es: "Masajistas" },
    groomer: { pt: "Groomers", en: "Groomers", es: "Groomers" },
    fornecedor_racoes: { pt: "Rações", en: "Feed Suppliers", es: "Piensos" },
    loja_equipamento: { pt: "Lojas", en: "Shops", es: "Tiendas" },
    centro_hipico: { pt: "Centros Hípicos", en: "Equestrian Centres", es: "Centros Hípicos" },
    hospedagem: { pt: "Pensão", en: "Boarding", es: "Pensión" },
    seguros: { pt: "Seguros", en: "Insurance", es: "Seguros" },
    mediador: { pt: "Mediadores", en: "Brokers", es: "Mediadores" },
    desbastador: { pt: "Desbastadores", en: "Breakers", es: "Desbastadores" },
    fisioterapeuta: { pt: "Fisioterapeutas", en: "Physiotherapists", es: "Fisioterapeutas" },
    terapeuta_alternativo: { pt: "Terapias", en: "Therapies", es: "Terapias" },
  };

  function getLabel(id: string): string {
    const entry = labelMap[id];
    if (!entry) return id;
    return language === "en" ? entry.en : language === "es" ? entry.es : entry.pt;
  }

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      role="tablist"
      aria-label={
        language === "pt"
          ? "Filtrar por categoria"
          : language === "es"
            ? "Filtrar por categoría"
            : "Filter by category"
      }
    >
      {categorias.map((cat) => {
        const isActive = categoriaAtiva === cat.id;
        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoriaChange(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? "bg-[var(--gold)] text-black font-semibold border-[var(--gold)] shadow-[0_2px_12px_rgba(197,160,89,0.20)]"
                : "bg-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/40 hover:bg-[var(--background-secondary)]"
            }`}
          >
            <cat.icon
              size={12}
              className={isActive ? "text-black" : "text-[var(--foreground-muted)]"}
            />
            {getLabel(cat.id)}
          </button>
        );
      })}
    </div>
  );
}

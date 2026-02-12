import { categorias } from "./constants";
import type { CategoriaProf } from "./types";

interface CategoriasTabsProps {
  categoriaAtiva: CategoriaProf | "todos";
  onCategoriaChange: (id: CategoriaProf | "todos") => void;
}

export function CategoriasTabs({ categoriaAtiva, onCategoriaChange }: CategoriasTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoriaChange(cat.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${categoriaAtiva === cat.id ? "bg-[var(--gold)] text-black font-medium" : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"}`}
        >
          <cat.icon size={14} />
          {cat.label}
        </button>
      ))}
    </div>
  );
}

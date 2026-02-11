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
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${categoriaAtiva === cat.id ? "bg-[#C5A059] text-black font-medium" : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
        >
          <cat.icon size={14} />
          {cat.label}
        </button>
      ))}
    </div>
  );
}

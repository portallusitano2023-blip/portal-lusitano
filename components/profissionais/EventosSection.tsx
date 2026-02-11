import { MapPin } from "lucide-react";
import type { Evento } from "./types";

const tipoConfig: Record<Evento["tipo"], { cor: string; bg: string }> = {
  clinica: { cor: "text-purple-400", bg: "bg-purple-500/20" },
  workshop: { cor: "text-blue-400", bg: "bg-blue-500/20" },
  conferencia: { cor: "text-[#C5A059]", bg: "bg-[#C5A059]/20" },
  curso: { cor: "text-green-400", bg: "bg-green-500/20" },
  webinar: { cor: "text-pink-400", bg: "bg-pink-500/20" },
};

export function EventosSection({ eventos }: { eventos: Evento[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {eventos.slice(0, 3).map((e) => (
        <div
          key={e.id}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-[#C5A059]/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-2 py-1 rounded text-xs ${tipoConfig[e.tipo].bg} ${tipoConfig[e.tipo].cor}`}
            >
              {e.tipo}
            </span>
            <span className="text-xs text-zinc-500">{e.data}</span>
          </div>
          <h3 className="font-medium text-white text-sm mb-1">{e.titulo}</h3>
          <p className="text-xs text-zinc-400 mb-3">{e.descricao}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <MapPin size={10} />
              {e.local}
            </div>
            <span className="text-xs text-[#C5A059] font-medium">{e.preco}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

import { MapPin } from "lucide-react";
import type { Evento } from "./types";

const tipoConfig: Record<Evento["tipo"], { cor: string; bg: string }> = {
  clinica: { cor: "text-purple-400", bg: "bg-purple-500/20" },
  workshop: { cor: "text-blue-400", bg: "bg-blue-500/20" },
  conferencia: { cor: "text-[var(--gold)]", bg: "bg-[var(--gold)]/20" },
  curso: { cor: "text-green-400", bg: "bg-green-500/20" },
  webinar: { cor: "text-pink-400", bg: "bg-pink-500/20" },
};

export function EventosSection({ eventos }: { eventos: Evento[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {eventos.slice(0, 3).map((e) => (
        <div
          key={e.id}
          className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-4 hover:border-[var(--gold)]/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-2 py-1 rounded text-xs ${tipoConfig[e.tipo].bg} ${tipoConfig[e.tipo].cor}`}
            >
              {e.tipo}
            </span>
            <span className="text-xs text-[var(--foreground-muted)]">{e.data}</span>
          </div>
          <h3 className="font-medium text-[var(--foreground)] text-sm mb-1">{e.titulo}</h3>
          <p className="text-xs text-[var(--foreground-secondary)] mb-3">{e.descricao}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-[var(--foreground-secondary)]">
              <MapPin size={10} />
              {e.local}
            </div>
            <span className="text-xs text-[var(--gold)] font-medium">{e.preco}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

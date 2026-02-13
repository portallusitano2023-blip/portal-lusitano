import { MapPin } from "lucide-react";
import type { Evento } from "./types";

const tipoConfig: Record<Evento["tipo"], { cor: string; bg: string }> = {
  clinica: { cor: "text-purple-400", bg: "bg-purple-500/20" },
  workshop: { cor: "text-blue-400", bg: "bg-blue-500/20" },
  conferencia: { cor: "text-[var(--gold)]", bg: "bg-[var(--gold)]/20" },
  curso: { cor: "text-green-400", bg: "bg-green-500/20" },
  webinar: { cor: "text-pink-400", bg: "bg-pink-500/20" },
};

function formatDate(dateStr: string): { dia: string; mes: string } {
  const parts = dateStr.split(/[\/\-\.]/);
  if (parts.length >= 2) {
    return { dia: parts[0].padStart(2, "0"), mes: parts[1].padStart(2, "0") };
  }
  return { dia: "--", mes: "--" };
}

const mesesAbrev = [
  "",
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function EventosSection({ eventos }: { eventos: Evento[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {eventos.slice(0, 3).map((e) => {
        const { dia, mes } = formatDate(e.data);
        const mesNum = parseInt(mes, 10);
        const mesLabel = mesNum >= 1 && mesNum <= 12 ? mesesAbrev[mesNum] : mes;

        return (
          <div key={e.id} className="card-premium shimmer-gold rounded-xl p-4 flex gap-4">
            {/* Date badge */}
            <div className="flex-shrink-0 w-14 h-16 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-[var(--gold)] leading-none">{dia}</span>
              <span className="text-[10px] uppercase text-[var(--gold)]/70 font-medium mt-0.5">
                {mesLabel}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] ${tipoConfig[e.tipo].bg} ${tipoConfig[e.tipo].cor}`}
                >
                  {e.tipo}
                </span>
              </div>
              <h3 className="font-medium text-[var(--foreground)] text-sm mb-1 truncate">
                {e.titulo}
              </h3>
              <p className="text-xs text-[var(--foreground-secondary)] mb-2 line-clamp-2">
                {e.descricao}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-[var(--foreground-secondary)]">
                  <MapPin size={10} />
                  <span className="truncate">{e.local}</span>
                </div>
                <span className="text-xs text-[var(--gold)] font-medium flex-shrink-0">
                  {e.preco}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

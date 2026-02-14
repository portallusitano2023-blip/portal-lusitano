import { MapPin, Globe } from "lucide-react";
import type { Evento } from "./types";

const tipoConfig: Record<Evento["tipo"], { cor: string; bg: string }> = {
  clinica: { cor: "text-purple-400", bg: "bg-purple-500/20" },
  workshop: { cor: "text-blue-400", bg: "bg-blue-500/20" },
  conferencia: { cor: "text-[var(--gold)]", bg: "bg-[var(--gold)]/20" },
  curso: { cor: "text-green-400", bg: "bg-green-500/20" },
  webinar: { cor: "text-pink-400", bg: "bg-pink-500/20" },
};

function parseDate(dateStr: string): { dia: string; mesLabel: string } {
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

  // Handle ISO date (yyyy-mm-dd) or dd-mm-yyyy
  const parts = dateStr.split(/[\/\-\.]/);
  if (parts.length >= 3 && parts[0].length === 4) {
    // ISO: yyyy-mm-dd
    const mesNum = parseInt(parts[1], 10);
    return {
      dia: parts[2].padStart(2, "0"),
      mesLabel: mesNum >= 1 && mesNum <= 12 ? mesesAbrev[mesNum] : parts[1],
    };
  }
  // Fallback: dd-mm-yyyy
  const mesNum = parseInt(parts[1], 10);
  return {
    dia: parts[0].padStart(2, "0"),
    mesLabel: mesNum >= 1 && mesNum <= 12 ? mesesAbrev[mesNum] : parts[1],
  };
}

export function EventosSection({ eventos }: { eventos: Evento[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {eventos.map((e) => {
        const { dia, mesLabel } = parseDate(e.data);

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
                  className={`px-2 py-0.5 rounded text-[10px] ${tipoConfig[e.tipo]?.bg || "bg-gray-500/20"} ${tipoConfig[e.tipo]?.cor || "text-gray-400"}`}
                >
                  {e.tipo}
                </span>
                {e.online && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400">
                    Online
                  </span>
                )}
              </div>
              <h3 className="font-medium text-[var(--foreground)] text-sm mb-1 truncate">
                {e.titulo}
              </h3>
              <p className="text-xs text-[var(--foreground-secondary)] mb-2 line-clamp-2">
                {e.descricao}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-[var(--foreground-secondary)]">
                  {e.online ? <Globe size={10} /> : <MapPin size={10} />}
                  <span className="truncate">{e.local || e.organizador}</span>
                </div>
                {e.preco && (
                  <span className="text-xs text-[var(--gold)] font-medium flex-shrink-0">
                    {e.preco}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

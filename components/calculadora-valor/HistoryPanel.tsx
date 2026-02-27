"use client";

import { History, X, TrendingUp } from "lucide-react";

export interface CalcHistoryEntry {
  timestamp: number;
  nome: string;
  valorFinal: number;
  confianca: number;
  treino: string;
}

interface HistoryPanelProps {
  history: CalcHistoryEntry[];
  show: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const TREINO_LABELS: Record<string, string> = {
  potro: "Potro",
  desbravado: "Desbravado",
  iniciado: "Iniciado",
  elementar: "Elementar",
  medio: "Médio",
  avancado: "Avançado",
  alta_escola: "Alta Escola",
  grand_prix: "Grand Prix",
};

export default function HistoryPanel({ history, show, onToggle, onClose }: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[var(--border)] hover:border-[var(--foreground-muted)]"
      >
        <History size={13} />
        <span className="hidden sm:inline">Histórico ({history.length})</span>
      </button>
      {show && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--background-card)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider">
              Últimas Avaliações
            </span>
            <button
              onClick={onClose}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Fechar histórico"
            >
              <X size={13} />
            </button>
          </div>
          <div className="divide-y divide-[var(--border)]/50 max-h-72 overflow-y-auto">
            {history.map((entry, i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#C5A059] font-semibold truncate max-w-[140px]">
                    {entry.nome || "Sem nome"}
                  </span>
                  <span className="text-[10px] text-[var(--foreground-muted)] shrink-0 ml-2">
                    {new Date(entry.timestamp).toLocaleDateString("pt-PT", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[var(--foreground)]">
                    {entry.valorFinal.toLocaleString("pt-PT")}€
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--background-secondary)] text-[var(--foreground-secondary)]">
                    {TREINO_LABELS[entry.treino] ?? entry.treino}
                  </span>
                  <span className="text-[10px] flex items-center gap-0.5 ml-auto">
                    <TrendingUp size={9} className="text-emerald-400" />
                    <span className="text-emerald-400">{entry.confianca}%</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

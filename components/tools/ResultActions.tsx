"use client";

import { Download, Share2, Save, Printer, Loader2 } from "lucide-react";

interface ResultActionsProps {
  onExportPDF: () => void;
  onShare: () => void;
  onSave?: () => void;
  onPrint?: () => void;
  isPremium?: boolean;
  isExporting?: boolean;
}

export default function ResultActions({
  onExportPDF,
  onShare,
  onSave,
  onPrint,
  isPremium = false,
  isExporting = false,
}: ResultActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onExportPDF}
        disabled={isExporting}
        className="flex-1 min-w-[140px] py-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-secondary)] text-sm font-medium hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {isExporting ? "A gerar..." : "Exportar PDF"}
      </button>

      <button
        onClick={onShare}
        className="flex-1 min-w-[140px] py-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-secondary)] text-sm font-medium hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)] transition-all flex items-center justify-center gap-2"
      >
        <Share2 size={16} />
        Partilhar
      </button>

      {onSave && (
        <button
          onClick={onSave}
          className={`flex-1 min-w-[140px] py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            isPremium
              ? "bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/20"
              : "bg-[var(--background-secondary)] border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)]"
          }`}
        >
          <Save size={16} />
          Guardar
        </button>
      )}

      {onPrint && (
        <button
          onClick={onPrint}
          className="py-3 px-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-secondary)] text-sm font-medium hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)] transition-all flex items-center justify-center"
        >
          <Printer size={16} />
        </button>
      )}
    </div>
  );
}

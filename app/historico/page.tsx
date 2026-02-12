"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Clock,
  FileText,
  Share2,
  Trash2,
  BarChart3,
  Calculator,
  Heart,
  UserCheck,
  ArrowLeft,
  Search,
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

// ============================================
// TIPOS
// ============================================

interface SavedResult {
  id: string;
  user_id: string;
  tool: string;
  title: string;
  created_at: string;
  data?: Record<string, unknown>;
}

// ============================================
// CONSTANTES
// ============================================

const TOOL_CONFIG: Record<string, { label: string; icon: React.ElementType; href: string }> = {
  calculadora: {
    label: "Calculadora de Valor",
    icon: Calculator,
    href: "/calculadora-valor",
  },
  comparador: {
    label: "Comparador de Cavalos",
    icon: BarChart3,
    href: "/comparador-cavalos",
  },
  compatibilidade: {
    label: "Verificador de Compatibilidade",
    icon: Heart,
    href: "/verificador-compatibilidade",
  },
  "analise-perfil": {
    label: "Analise de Perfil",
    icon: UserCheck,
    href: "/analise-perfil",
  },
};

const FALLBACK_TOOL = {
  label: "Resultado",
  icon: FileText,
  href: "/",
};

const MESES_PT = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// ============================================
// UTILIDADES
// ============================================

function formatDatePT(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = MESES_PT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

function getToolConfig(tool: string) {
  return TOOL_CONFIG[tool] || { ...FALLBACK_TOOL, label: tool };
}

// ============================================
// COMPONENTES
// ============================================

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="bg-[var(--background-secondary)]/80 border border-[var(--border)] p-6 animate-pulse opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.1}s` }}
      role="status"
      aria-label="A carregar resultado"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[var(--background-elevated)] rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-[var(--background-elevated)] rounded w-32 mb-2" />
          <div className="h-3 bg-[var(--background-elevated)]/60 rounded w-20" />
        </div>
      </div>
      <div className="h-5 bg-[var(--background-elevated)] rounded w-3/4 mb-3" />
      <div className="h-3 bg-[var(--background-elevated)]/60 rounded w-40 mb-6" />
      <div className="flex gap-3">
        <div className="h-10 bg-[var(--background-elevated)] rounded flex-1" />
        <div className="h-10 bg-[var(--background-elevated)] rounded w-10" />
        <div className="h-10 bg-[var(--background-elevated)] rounded w-10" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="text-center py-20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="w-20 h-20 bg-[var(--background-secondary)]/80 border border-[var(--border)] rounded-full flex items-center justify-center mx-auto mb-6">
        <FileText className="text-[var(--foreground-muted)]" size={36} />
      </div>
      <h2 className="text-2xl font-serif text-[var(--foreground)] mb-3">
        Ainda nao tem resultados guardados
      </h2>
      <p className="text-[var(--foreground-muted)] mb-8 max-w-md mx-auto">
        Utilize as nossas ferramentas e guarde os resultados para consultar mais tarde.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {Object.entries(TOOL_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Link
              key={key}
              href={config.href}
              className="inline-flex items-center gap-2 bg-[var(--background-secondary)]/80 border border-[var(--border)] text-[var(--foreground)] px-5 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:border-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors"
            >
              <Icon size={14} />
              {config.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ResultCard({
  result,
  index,
  onDelete,
  onShare,
}: {
  result: SavedResult;
  index: number;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}) {
  const config = getToolConfig(result.tool);
  const Icon = config.icon;

  return (
    <article
      className="group bg-[var(--background-secondary)]/80 border border-[var(--border)] p-6 hover:border-[var(--gold)]/30 transition-all duration-300 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Tool badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon className="text-[var(--gold)]" size={18} />
        </div>
        <div className="min-w-0">
          <span className="text-xs uppercase tracking-[0.15em] text-[var(--gold)] font-medium">
            {config.label}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-serif text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors line-clamp-2">
        {result.title}
      </h3>

      {/* Date */}
      <div className="flex items-center gap-1.5 text-[var(--foreground-muted)] text-sm mb-6">
        <Clock size={13} />
        <time dateTime={result.created_at}>{formatDatePT(result.created_at)}</time>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/resultado/${result.id}`}
          className="flex-1 bg-[var(--gold)] text-black py-2.5 text-xs uppercase tracking-[0.15em] font-bold hover:bg-[var(--gold-hover)] transition-colors text-center flex items-center justify-center gap-2"
        >
          <Search size={14} />
          Ver
        </Link>
        <button
          onClick={() => onShare(result.id)}
          className="w-10 border border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:border-[var(--gold)]/50 transition-colors flex items-center justify-center"
          title="Partilhar resultado"
          aria-label={`Partilhar resultado: ${result.title}`}
        >
          <Share2 size={16} />
        </button>
        <button
          onClick={() => onDelete(result.id)}
          className="w-10 border border-[var(--border)] text-[var(--foreground-secondary)] hover:text-red-500 hover:border-red-500/50 transition-colors flex items-center justify-center"
          title="Eliminar resultado"
          aria-label={`Eliminar resultado: ${result.title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}

function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="bg-[var(--background-secondary)] border border-[var(--border)] p-6 max-w-sm w-full">
        <h3 id="confirm-dialog-title" className="text-lg font-serif text-[var(--foreground)] mb-3">
          Eliminar resultado?
        </h3>
        <p className="text-[var(--foreground-secondary)] text-sm mb-6">
          Esta accao nao pode ser desfeita. O resultado sera permanentemente eliminado.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-[var(--border)] text-[var(--foreground)] py-2.5 text-xs uppercase tracking-[0.15em] font-medium hover:border-[var(--border-hover)] transition-colors"
            autoFocus
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2.5 text-xs uppercase tracking-[0.15em] font-bold hover:bg-red-500 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CONTEUDO PRINCIPAL
// ============================================

function HistoricoContent() {
  const { user } = useAuth();
  const [results, setResults] = useState<SavedResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from("saved_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setResults(data || []);
    } catch (err) {
      console.error("Erro ao carregar resultados:", err);
      setError("Nao foi possivel carregar os resultados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleDelete = async () => {
    if (!deleteId || !user) return;

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: deleteError } = await supabase
        .from("saved_results")
        .delete()
        .eq("id", deleteId)
        .eq("user_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      setResults((prev) => prev.filter((r) => r.id !== deleteId));
    } catch (err) {
      console.error("Erro ao eliminar resultado:", err);
      setError("Nao foi possivel eliminar o resultado. Tente novamente.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleShare = async (id: string) => {
    const url = `${window.location.origin}/resultado/${id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Resultado - Portal Lusitano",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {
      // User cancelled the share dialog or clipboard failed silently
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="text-center py-20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
        role="alert"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="text-red-500" size={28} />
        </div>
        <h2 className="text-xl font-serif text-[var(--foreground)] mb-3">{error}</h2>
        <button
          onClick={fetchResults}
          className="mt-4 bg-[var(--gold)] text-black px-6 py-3 text-xs uppercase tracking-[0.15em] font-bold hover:bg-[var(--gold-hover)] transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Empty state
  if (results.length === 0) {
    return <EmptyState />;
  }

  // Results grid
  return (
    <>
      <p className="text-[var(--foreground-muted)] text-sm mb-6">
        {results.length} resultado{results.length !== 1 ? "s" : ""} guardado
        {results.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <ResultCard
            key={result.id}
            result={result}
            index={index}
            onDelete={(id) => setDeleteId(id)}
            onShare={handleShare}
          />
        ))}
      </div>

      {/* Toast for copy confirmation */}
      {copiedId && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--background-secondary)] border border-[var(--gold)]/30 text-[var(--foreground)] px-5 py-3 text-sm flex items-center gap-2 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
          role="status"
          aria-live="polite"
        >
          <Share2 size={14} className="text-[var(--gold)]" />
          Link copiado para a area de transferencia
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}

// ============================================
// PAGINA
// ============================================

export default function HistoricoPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Voltar ao inicio
            </Link>
          </div>

          {/* Header */}
          <div
            className="text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="text-[var(--gold)]" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
              Historico de Resultados
            </h1>
            <p className="text-[var(--foreground-secondary)] font-serif italic">
              Consulte e partilhe os seus resultados guardados
            </p>
          </div>

          {/* Content */}
          <HistoricoContent />
        </div>
      </main>
    </AuthGuard>
  );
}

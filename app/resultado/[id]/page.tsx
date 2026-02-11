"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Calculator,
  GitCompare,
  Heart,
  User,
  AlertCircle,
} from "lucide-react";
import ShareButtons from "@/components/ShareButtons";

// ============================================
// TYPES
// ============================================

interface SavedResult {
  id: string;
  user_id: string;
  tool_name: string;
  title: string;
  form_data: Record<string, unknown>;
  result_data: Record<string, unknown>;
  share_id: string | null;
  is_public: boolean;
  created_at: string;
}

// ============================================
// TOOL LABELS & CONFIG
// ============================================

const TOOL_CONFIG: Record<string, { label: string; icon: React.ReactNode; href: string }> = {
  calculadora: {
    label: "Calculadora de Valor",
    icon: <Calculator className="w-5 h-5" />,
    href: "/calculadora-valor",
  },
  comparador: {
    label: "Comparador de Cavalos",
    icon: <GitCompare className="w-5 h-5" />,
    href: "/comparador-cavalos",
  },
  compatibilidade: {
    label: "Verificador de Compatibilidade",
    icon: <Heart className="w-5 h-5" />,
    href: "/verificador-compatibilidade",
  },
  perfil: {
    label: "Analise de Perfil",
    icon: <User className="w-5 h-5" />,
    href: "/analise-perfil",
  },
};

// ============================================
// HELPERS
// ============================================

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "boolean") return value ? "Sim" : "Nao";
  if (typeof value === "number") {
    if (Number.isInteger(value) && value > 1000) {
      return value.toLocaleString("pt-PT");
    }
    if (!Number.isInteger(value)) {
      return value.toLocaleString("pt-PT", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      });
    }
    return String(value);
  }
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================
// SKELETON
// ============================================

function ResultSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back link skeleton */}
        <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse" />

        {/* Header skeleton */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-8 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
              <div className="h-5 w-full bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Result skeleton */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-8 space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-28 bg-zinc-800 rounded animate-pulse" />
              <div
                className="h-5 bg-zinc-800 rounded animate-pulse"
                style={{ width: `${60 + (i + 1) * 7}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// DATA GRID COMPONENT
// ============================================

function DataGrid({
  data,
  highlightKeys,
}: {
  data: Record<string, unknown>;
  highlightKeys?: string[];
}) {
  const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== "");

  if (entries.length === 0) {
    return <p className="text-zinc-500 text-sm italic">Sem dados disponiveis.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      {entries.map(([key, value]) => {
        const isHighlighted = highlightKeys?.includes(key);
        const isNestedObject = typeof value === "object" && value !== null && !Array.isArray(value);
        const isArray = Array.isArray(value);

        // Nested objects get a full-width card
        if (isNestedObject) {
          return (
            <div
              key={key}
              className="col-span-1 sm:col-span-2 bg-zinc-800/40 border border-white/5 rounded-lg p-4"
            >
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-3">
                {formatLabel(key)}
              </span>
              <DataGrid data={value as Record<string, unknown>} />
            </div>
          );
        }

        // Arrays of objects get a special treatment
        if (isArray && value.length > 0 && typeof value[0] === "object") {
          return (
            <div
              key={key}
              className="col-span-1 sm:col-span-2 bg-zinc-800/40 border border-white/5 rounded-lg p-4"
            >
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-3">
                {formatLabel(key)}
              </span>
              <div className="space-y-3">
                {(value as Record<string, unknown>[]).map((item, idx) => (
                  <div key={idx} className="bg-zinc-900/60 border border-white/5 rounded-lg p-3">
                    <DataGrid data={item} />
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={key}>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
              {formatLabel(key)}
            </span>
            <p
              className={`text-base ${
                isHighlighted ? "text-[#C5A059] font-semibold text-lg" : "text-white"
              }`}
            >
              {formatValue(value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// TOOL-SPECIFIC RENDERERS
// ============================================

function CalculadoraResult({
  formData,
  resultData,
}: {
  formData: Record<string, unknown>;
  resultData: Record<string, unknown>;
}) {
  return (
    <div className="space-y-8">
      {/* Form inputs */}
      <section className="bg-zinc-900/80 border border-white/10 rounded-xl p-8">
        <h2 className="text-lg font-serif text-[#C5A059] mb-6">Caracteristicas do Cavalo</h2>
        <DataGrid data={formData} />
      </section>

      {/* Result */}
      <section className="bg-zinc-900/80 border border-white/10 rounded-xl p-8">
        <h2 className="text-lg font-serif text-[#C5A059] mb-6">Resultado da Avaliacao</h2>
        <DataGrid
          data={resultData}
          highlightKeys={["valorFinal", "valorMin", "valorMax", "confianca"]}
        />
      </section>
    </div>
  );
}

function ComparadorResult({
  formData,
  resultData,
}: {
  formData: Record<string, unknown>;
  resultData: Record<string, unknown>;
}) {
  return (
    <div className="space-y-8">
      <section className="bg-zinc-900/80 border border-white/10 rounded-xl p-8">
        <h2 className="text-lg font-serif text-[#C5A059] mb-6">Cavalos Comparados</h2>
        <DataGrid data={formData} />
      </section>

      <section className="bg-zinc-900/80 border border-white/10 rounded-xl p-8">
        <h2 className="text-lg font-serif text-[#C5A059] mb-6">Resultado da Comparacao</h2>
        <DataGrid data={resultData} />
      </section>
    </div>
  );
}

function CompatibilidadeResult({
  formData,
  resultData,
}: {
  formData: Record<string, unknown>;
  resultData: Record<string, unknown>;
}) {
  return (
    <div className="space-y-8">
      <section className="bg-zinc-900/80 border border-white/10 rounded-xl p-8">
        <h2 className="text-lg font-serif text-[#C5A059] mb-6">Garanhao e Egua</h2>
        <DataGrid data={formData} />
      </section>

      <section className="bg-zinc-900/80 border border-white/10 rounded-xl p-8">
        <h2 className="text-lg font-serif text-[#C5A059] mb-6">Resultado de Compatibilidade</h2>
        <DataGrid
          data={resultData}
          highlightKeys={["compatibilidade", "score", "pontuacao", "resultado"]}
        />
      </section>
    </div>
  );
}

function PerfilResult({
  formData,
  resultData,
}: {
  formData: Record<string, unknown>;
  resultData: Record<string, unknown>;
}) {
  return (
    <div className="space-y-8">
      <section className="bg-zinc-900/80 border border-white/10 rounded-xl p-8">
        <h2 className="text-lg font-serif text-[#C5A059] mb-6">Dados do Perfil</h2>
        <DataGrid data={formData} />
      </section>

      <section className="bg-zinc-900/80 border border-white/10 rounded-xl p-8">
        <h2 className="text-lg font-serif text-[#C5A059] mb-6">Analise de Perfil</h2>
        <DataGrid data={resultData} highlightKeys={["tipo", "perfil", "categoria"]} />
      </section>
    </div>
  );
}

function GenericResult({
  formData,
  resultData,
}: {
  formData: Record<string, unknown>;
  resultData: Record<string, unknown>;
}) {
  return (
    <div className="space-y-8">
      {Object.keys(formData).length > 0 && (
        <section className="bg-zinc-900/80 border border-white/10 rounded-xl p-8">
          <h2 className="text-lg font-serif text-[#C5A059] mb-6">Dados Submetidos</h2>
          <DataGrid data={formData} />
        </section>
      )}

      <section className="bg-zinc-900/80 border border-white/10 rounded-xl p-8">
        <h2 className="text-lg font-serif text-[#C5A059] mb-6">Resultado</h2>
        <DataGrid data={resultData} />
      </section>
    </div>
  );
}

// ============================================
// NOT FOUND STATE
// ============================================

function NotFoundState() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/ferramentas"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-12 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar as Ferramentas
        </Link>

        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-white mb-2">Resultado nao encontrado</h1>
          <p className="text-zinc-400 max-w-md mx-auto">
            Este resultado pode ter sido removido, ou o link de partilha pode estar incorreto.
            Verifique o URL e tente novamente.
          </p>
          <Link
            href="/ferramentas"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#C5A059] text-black text-sm font-semibold rounded-lg hover:bg-[#d4b06a] transition-colors"
          >
            Explorar Ferramentas
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function ResultadoPage() {
  const params = useParams();
  const id = params.id as string;

  const { user, isLoading: authLoading } = useAuth();
  const [result, setResult] = useState<SavedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const fetchResult = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setNotFound(false);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("saved_results")
        .select("*")
        .or(`share_id.eq.${id},id.eq.${id}`)
        .single();

      if (error || !data) {
        setNotFound(true);
        return;
      }

      // Check access: must be public or owned by the current user
      const resultData = data as SavedResult;
      if (!resultData.is_public && resultData.user_id !== user?.id) {
        setNotFound(true);
        return;
      }

      setResult(resultData);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    // Wait for auth to settle before fetching
    if (!authLoading) {
      fetchResult();
    }
  }, [authLoading, fetchResult]);

  // --- Loading state ---
  if (loading || authLoading) {
    return <ResultSkeleton />;
  }

  // --- Not found ---
  if (notFound || !result) {
    return <NotFoundState />;
  }

  // --- Resolved data ---
  const toolConfig = TOOL_CONFIG[result.tool_name] || {
    label: result.tool_name,
    icon: <Calculator className="w-5 h-5" />,
    href: "/ferramentas",
  };

  const isOwner = user?.id === result.user_id;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/resultado/${result.share_id || result.id}`
      : "";

  // Select the correct renderer
  const ResultRenderer =
    {
      calculadora: CalculadoraResult,
      comparador: ComparadorResult,
      compatibilidade: CompatibilidadeResult,
      perfil: PerfilResult,
    }[result.tool_name] || GenericResult;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back navigation */}
        <Link
          href={isOwner ? "/historico" : "/ferramentas"}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {isOwner ? "Voltar ao Historico" : "Voltar as Ferramentas"}
        </Link>

        {/* Header card */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            {/* Tool info */}
            <div className="flex items-start gap-4 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl flex items-center justify-center text-[#C5A059]">
                {toolConfig.icon}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-serif text-white truncate">{result.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <Link
                    href={toolConfig.href}
                    className="text-sm text-[#C5A059] hover:underline inline-flex items-center gap-1"
                  >
                    {toolConfig.label}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <span className="text-zinc-600">|</span>
                  <span className="text-sm text-zinc-400 inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(result.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Share actions */}
            {result.is_public && (
              <div className="flex-shrink-0">
                <ShareButtons
                  title={result.title}
                  url={shareUrl}
                  utmCampaign="resultado-partilha"
                  variant="dialog"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tool-specific result display */}
        <ResultRenderer formData={result.form_data || {}} resultData={result.result_data || {}} />

        {/* Footer actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href={isOwner ? "/historico" : "/ferramentas"}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {isOwner ? "Voltar ao Historico" : "Voltar as Ferramentas"}
          </Link>

          <Link
            href={toolConfig.href}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] text-black text-sm font-semibold rounded-lg hover:bg-[#d4b06a] transition-colors"
          >
            Usar {toolConfig.label}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

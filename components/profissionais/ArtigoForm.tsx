"use client";

import { useState } from "react";
import { X, Loader2, FileText } from "lucide-react";

const CATEGORIAS_ARTIGO = [
  "Veterinária",
  "Nutrição",
  "Treino",
  "Reprodução",
  "Ferração",
  "Equipamento",
  "Saúde",
  "Dressage",
  "Salto",
  "Working Equitation",
  "Atrelagem",
  "Criação",
  "Outro",
];

interface ArtigoFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ArtigoForm({ onClose, onSuccess }: ArtigoFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titulo: "",
    categoria: "Treino",
    resumo: "",
    conteudo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/profissionais/meus-artigos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar artigo");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar artigo");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--gold)] outline-none transition-colors text-sm";
  const labelClass = "block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[var(--gold)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Escrever Artigo</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Título *</label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
              placeholder="Ex: Guia de Nutrição para Cavalos de Desporto"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Categoria *</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))}
              className={inputClass}
            >
              {CATEGORIAS_ARTIGO.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Resumo * <span className="normal-case opacity-60">(aparece nos cards)</span>
            </label>
            <textarea
              value={form.resumo}
              onChange={(e) => setForm((p) => ({ ...p, resumo: e.target.value }))}
              placeholder="Breve resumo do artigo (máx. 300 caracteres)"
              required
              rows={2}
              maxLength={500}
              className={`${inputClass} resize-none`}
            />
            <span className="text-xs text-[var(--foreground-muted)] mt-1 block">
              {form.resumo.length}/500
            </span>
          </div>

          <div>
            <label className={labelClass}>Conteúdo *</label>
            <textarea
              value={form.conteudo}
              onChange={(e) => setForm((p) => ({ ...p, conteudo: e.target.value }))}
              placeholder="Escreva o seu artigo aqui..."
              required
              rows={8}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[var(--border)] rounded-lg text-sm text-[var(--foreground-secondary)] hover:bg-[var(--background-card)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !form.titulo || !form.resumo || !form.conteudo}
              className="flex-1 py-3 bg-[var(--gold)] text-black font-semibold rounded-lg text-sm hover:bg-[var(--gold-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "A publicar..." : "Publicar Artigo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

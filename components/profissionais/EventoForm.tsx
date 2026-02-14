"use client";

import { useState } from "react";
import { X, Loader2, CalendarDays } from "lucide-react";

const TIPOS_EVENTO = [
  { id: "clinica", label: "Clínica" },
  { id: "workshop", label: "Workshop" },
  { id: "conferencia", label: "Conferência" },
  { id: "curso", label: "Curso" },
  { id: "webinar", label: "Webinar" },
];

interface EventoFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function EventoForm({ onClose, onSuccess }: EventoFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titulo: "",
    tipo: "clinica",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    local: "",
    pais: "",
    online: false,
    link_inscricao: "",
    preco: "",
    vagas: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/profissionais/meus-eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar evento");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar evento");
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
            <CalendarDays size={18} className="text-[var(--gold)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Criar Evento</h2>
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
              placeholder="Ex: Clínica de Dressage Avançado"
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Tipo *</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
                className={inputClass}
              >
                {TIPOS_EVENTO.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Preço</label>
              <input
                type="text"
                value={form.preco}
                onChange={(e) => setForm((p) => ({ ...p, preco: e.target.value }))}
                placeholder="Ex: €150 ou Gratuito"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Descrição *</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
              placeholder="Descreva o evento, o que será abordado, nível dos participantes..."
              required
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Data Início *</label>
              <input
                type="date"
                value={form.data_inicio}
                onChange={(e) => setForm((p) => ({ ...p, data_inicio: e.target.value }))}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Data Fim</label>
              <input
                type="date"
                value={form.data_fim}
                onChange={(e) => setForm((p) => ({ ...p, data_fim: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Local / Cidade</label>
              <input
                type="text"
                value={form.local}
                onChange={(e) => setForm((p) => ({ ...p, local: e.target.value }))}
                placeholder="Ex: Golegã"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Vagas</label>
              <input
                type="number"
                value={form.vagas}
                onChange={(e) => setForm((p) => ({ ...p, vagas: e.target.value }))}
                placeholder="Ex: 10"
                min={1}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.online}
              onChange={(e) => setForm((p) => ({ ...p, online: e.target.checked }))}
              id="evento-online"
              className="w-4 h-4 accent-[#C5A059]"
            />
            <label htmlFor="evento-online" className="text-sm text-[var(--foreground-secondary)]">
              Evento online / com transmissão
            </label>
          </div>

          <div>
            <label className={labelClass}>Link de Inscrição</label>
            <input
              type="url"
              value={form.link_inscricao}
              onChange={(e) => setForm((p) => ({ ...p, link_inscricao: e.target.value }))}
              placeholder="https://..."
              className={inputClass}
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
              disabled={loading || !form.titulo || !form.descricao || !form.data_inicio}
              className="flex-1 py-3 bg-[var(--gold)] text-black font-semibold rounded-lg text-sm hover:bg-[var(--gold-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "A criar..." : "Criar Evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

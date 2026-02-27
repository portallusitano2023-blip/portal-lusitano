"use client";

import { Upload, CheckCircle, Shield } from "lucide-react";
import type { StepProps, Documentos, DocumentType } from "@/components/vender-cavalo/types";
import { niveisTreino, disciplinasOpcoes } from "@/components/vender-cavalo/data";
import { useLanguage } from "@/context/LanguageContext";

interface StepTreinoSaudeProps extends StepProps {
  documentos: Documentos;
  onDocUpload: (type: DocumentType, file: File) => void;
  onToggleDisciplina: (disc: string) => void;
}

export default function StepTreinoSaude({
  formData,
  updateField,
  documentos,
  onDocUpload,
  onToggleDisciplina,
}: StepTreinoSaudeProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[var(--gold)] rounded-full flex items-center justify-center text-black text-sm font-bold">
          4
        </span>
        {t.vender_cavalo.step_training_title}
      </h2>

      <div className="space-y-6">
        {/* Treino */}
        <div>
          <label
            htmlFor="nivel_treino"
            className="block text-sm text-[var(--foreground-secondary)] mb-2"
          >
            {t.vender_cavalo.training_level} *
          </label>
          <select
            id="nivel_treino"
            required
            value={formData.nivel_treino}
            onChange={(e) => updateField("nivel_treino", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
          >
            <option value="">{t.vender_cavalo.select}</option>
            {niveisTreino.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Disciplinas */}
        <div>
          <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
            {t.vender_cavalo.disciplines}
          </label>
          <div className="flex flex-wrap gap-2">
            {disciplinasOpcoes.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => onToggleDisciplina(disc)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors touch-manipulation ${
                  formData.disciplinas.includes(disc)
                    ? "bg-[var(--gold)] text-black"
                    : "bg-[var(--background-card)] text-[var(--foreground-secondary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>

        {/* Competições */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="competicoes"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.competitions}
            </label>
            <input
              id="competicoes"
              type="text"
              value={formData.competicoes}
              onChange={(e) => updateField("competicoes", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_competitions}
            />
          </div>
          <div>
            <label
              htmlFor="premios"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.awards}
            </label>
            <input
              id="premios"
              type="text"
              value={formData.premios}
              onChange={(e) => updateField("premios", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_awards}
            />
          </div>
        </div>

        {/* Saúde */}
        <div className="border-t border-[var(--border)] pt-6">
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
            <Shield size={18} className="text-[var(--gold)]" />
            {t.vender_cavalo.health_status_section}
          </h3>

          <div>
            <label
              htmlFor="estado_saude"
              className="block text-sm text-[var(--foreground-secondary)] mb-2"
            >
              {t.vender_cavalo.general_status} *
            </label>
            <select
              id="estado_saude"
              required
              value={formData.estado_saude}
              onChange={(e) => updateField("estado_saude", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">{t.vender_cavalo.select}</option>
              <option value="Excelente">{t.vender_cavalo.health_excellent}</option>
              <option value="Bom">{t.vender_cavalo.health_good}</option>
              <option value="Regular">{t.vender_cavalo.health_fair}</option>
            </select>
          </div>

          <div className="mt-4 space-y-3">
            <label
              htmlFor="vacinacao_atualizada"
              className="flex items-center gap-3 cursor-pointer touch-manipulation"
            >
              <input
                id="vacinacao_atualizada"
                type="checkbox"
                checked={formData.vacinacao_atualizada}
                onChange={(e) => updateField("vacinacao_atualizada", e.target.checked)}
                className="w-5 h-5 accent-[var(--gold)]"
              />
              <span className="text-sm">{t.vender_cavalo.vaccination_updated} *</span>
            </label>
            <label
              htmlFor="desparasitacao_atualizada"
              className="flex items-center gap-3 cursor-pointer touch-manipulation"
            >
              <input
                id="desparasitacao_atualizada"
                type="checkbox"
                checked={formData.desparasitacao_atualizada}
                onChange={(e) => updateField("desparasitacao_atualizada", e.target.checked)}
                className="w-5 h-5 accent-[var(--gold)]"
              />
              <span className="text-sm">{t.vender_cavalo.deworming_updated}</span>
            </label>
            <label
              htmlFor="exame_veterinario"
              className="flex items-center gap-3 cursor-pointer touch-manipulation"
            >
              <input
                id="exame_veterinario"
                type="checkbox"
                checked={formData.exame_veterinario}
                onChange={(e) => updateField("exame_veterinario", e.target.checked)}
                className="w-5 h-5 accent-[var(--gold)]"
              />
              <span className="text-sm">{t.vender_cavalo.vet_exam_available}</span>
            </label>
          </div>

          <div className="mt-4">
            <label
              htmlFor="observacoes_saude"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.health_notes}
            </label>
            <textarea
              id="observacoes_saude"
              value={formData.observacoes_saude}
              onChange={(e) => updateField("observacoes_saude", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] h-24 resize-none"
              placeholder={t.vender_cavalo.placeholder_health_notes}
            />
          </div>

          {/* Upload Exame Veterinário */}
          {formData.exame_veterinario && (
            <div className="mt-4 bg-[var(--background-card)]/50 border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t.vender_cavalo.vet_report}</span>
                {documentos.exameVet && <CheckCircle size={18} className="text-green-400" />}
              </div>
              <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--gold)] transition-colors touch-manipulation">
                <Upload size={18} className="text-[var(--foreground-muted)]" />
                <span className="text-sm text-[var(--foreground-secondary)]">
                  {documentos.exameVet ? documentos.exameVet.name : t.vender_cavalo.attach_report}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && onDocUpload("exameVet", e.target.files[0])
                  }
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

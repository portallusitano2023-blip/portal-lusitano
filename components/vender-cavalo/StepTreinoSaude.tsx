"use client";

import { Upload, CheckCircle, Shield } from "lucide-react";
import type { StepProps, Documentos, DocumentType } from "@/components/vender-cavalo/types";
import { niveisTreino, disciplinasOpcoes } from "@/components/vender-cavalo/data";

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
  return (
    <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[var(--gold)] rounded-full flex items-center justify-center text-black text-sm font-bold">
          4
        </span>
        Treino e Saúde
      </h2>

      <div className="space-y-6">
        {/* Treino */}
        <div>
          <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
            Nível de Treino *
          </label>
          <select
            required
            value={formData.nivel_treino}
            onChange={(e) => updateField("nivel_treino", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
          >
            <option value="">Selecionar</option>
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
            Disciplinas
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
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Competições
            </label>
            <input
              type="text"
              value={formData.competicoes}
              onChange={(e) => updateField("competicoes", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="Competições em que participou"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Prémios/Classificações
            </label>
            <input
              type="text"
              value={formData.premios}
              onChange={(e) => updateField("premios", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="Resultados obtidos"
            />
          </div>
        </div>

        {/* Saúde */}
        <div className="border-t border-[var(--border)] pt-6">
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
            <Shield size={18} className="text-[var(--gold)]" />
            Estado de Saúde
          </h3>

          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
              Estado Geral *
            </label>
            <select
              required
              value={formData.estado_saude}
              onChange={(e) => updateField("estado_saude", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">Selecionar</option>
              <option value="Excelente">Excelente - Sem qualquer problema</option>
              <option value="Bom">Bom - Pequenas questões menores</option>
              <option value="Regular">Regular - Requer atenção específica</option>
            </select>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
              <input
                type="checkbox"
                checked={formData.vacinacao_atualizada}
                onChange={(e) => updateField("vacinacao_atualizada", e.target.checked)}
                className="w-5 h-5 accent-[var(--gold)]"
              />
              <span className="text-sm">Vacinação atualizada *</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
              <input
                type="checkbox"
                checked={formData.desparasitacao_atualizada}
                onChange={(e) => updateField("desparasitacao_atualizada", e.target.checked)}
                className="w-5 h-5 accent-[var(--gold)]"
              />
              <span className="text-sm">Desparasitação atualizada</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
              <input
                type="checkbox"
                checked={formData.exame_veterinario}
                onChange={(e) => updateField("exame_veterinario", e.target.checked)}
                className="w-5 h-5 accent-[var(--gold)]"
              />
              <span className="text-sm">Exame veterinário disponível</span>
            </label>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Observações de Saúde
            </label>
            <textarea
              value={formData.observacoes_saude}
              onChange={(e) => updateField("observacoes_saude", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] h-24 resize-none"
              placeholder="Informações relevantes sobre a saúde do cavalo"
            />
          </div>

          {/* Upload Exame Veterinário */}
          {formData.exame_veterinario && (
            <div className="mt-4 bg-[var(--background-card)]/50 border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Relatório Veterinário</span>
                {documentos.exameVet && <CheckCircle size={18} className="text-green-400" />}
              </div>
              <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--gold)] transition-colors touch-manipulation">
                <Upload size={18} className="text-[var(--foreground-muted)]" />
                <span className="text-sm text-[var(--foreground-secondary)]">
                  {documentos.exameVet ? documentos.exameVet.name : "Anexar relatório"}
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

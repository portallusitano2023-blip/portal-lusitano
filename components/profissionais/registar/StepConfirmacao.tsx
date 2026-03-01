"use client";

import NextImage from "next/image";
import { ArrowRight, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { modalidades } from "@/components/profissionais/constants";
import type { StepConfirmacaoProps } from "./types";

export default function StepConfirmacao({
  formData,
  tp,
  styles,
  fotoPreview,
  categoriaLabel,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  isStep4Valid,
  onBack,
}: StepConfirmacaoProps) {
  const { sectionTitleClass } = styles;

  return (
    <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
      <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6 text-center">
        {tp.heading_confirm}
      </h2>

      <div className="max-w-2xl mx-auto">
        {/* Resumo Completo */}
        <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] p-6 mb-6">
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">{tp.summary_title}</h3>

          {/* Identificacao */}
          <div className="mb-4">
            <span className={sectionTitleClass}>{tp.heading_identity}</span>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--foreground-muted)]">{tp.summary_name}</span>
                <div className="flex items-center gap-3">
                  {fotoPreview && (
                    <NextImage
                      src={fotoPreview}
                      alt={formData.nome}
                      width={32}
                      height={32}
                      unoptimized
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  )}
                  <span className="text-[var(--foreground)]">{formData.nome}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">{tp.summary_email}</span>
                <span className="text-[var(--foreground)]">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">{tp.summary_phone}</span>
                <span className="text-[var(--foreground)]">{formData.telefone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">{tp.summary_category}</span>
                <span className="text-[var(--foreground)]">{categoriaLabel}</span>
              </div>
              {formData.especialidade && (
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">{tp.summary_specialty}</span>
                  <span className="text-[var(--foreground)]">{formData.especialidade}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">{tp.summary_experience}</span>
                <span className="text-[var(--foreground)]">
                  {formData.anosExperiencia} {tp.summary_experience_suffix}
                </span>
              </div>
            </div>
          </div>

          {/* Localizacao */}
          <div className="mb-4 pt-4 border-t border-[var(--border)]/50">
            <span className={sectionTitleClass}>{tp.summary_section_location}</span>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">{tp.summary_modality}</span>
                <span className="text-[var(--foreground)]">
                  {modalidades.find((m) => m.id === formData.modalidade)?.label ||
                    formData.modalidade}
                </span>
              </div>
              {(formData.distrito || formData.cidade || formData.pais) && (
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">{tp.summary_location}</span>
                  <span className="text-[var(--foreground)]">
                    {formData.modalidade === "clinicas_internacionais"
                      ? tp.summary_international
                      : formData.modalidade === "online"
                        ? formData.pais || tp.summary_online
                        : `${formData.cidade ? `${formData.cidade}, ` : ""}${formData.distrito}`}
                  </span>
                </div>
              )}
              {formData.morada && (
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">{tp.summary_address}</span>
                  <span className="text-[var(--foreground)]">{formData.morada}</span>
                </div>
              )}
              {formData.raioServico > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">{tp.summary_radius}</span>
                  <span className="text-[var(--foreground)]">{formData.raioServico} km</span>
                </div>
              )}
              {formData.aceitaDeslocacoes && (
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">{tp.summary_travel}</span>
                  <span className="text-green-400">{tp.summary_yes}</span>
                </div>
              )}
              {formData.servicos.length > 0 && (
                <div>
                  <span className="text-[var(--foreground-muted)] block mb-1">
                    {tp.summary_services}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {formData.servicos.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-[var(--background-card)] text-xs text-[var(--foreground-secondary)] border border-[var(--border)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {formData.idiomas.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">{tp.summary_languages}</span>
                  <span className="text-[var(--foreground)]">{formData.idiomas.join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Credenciais */}
          <div className="pt-4 border-t border-[var(--border)]/50">
            <span className={sectionTitleClass}>{tp.summary_section_credentials}</span>
            <div className="space-y-2 text-sm">
              {formData.formacaoAcademica && (
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">{tp.summary_education}</span>
                  <span className="text-[var(--foreground)]">{formData.formacaoAcademica}</span>
                </div>
              )}
              {formData.certificacoes.length > 0 && (
                <div>
                  <span className="text-[var(--foreground-muted)] block mb-1">
                    {tp.summary_certifications}
                  </span>
                  {formData.certificacoes.map((c, i) => (
                    <p key={i} className="text-[var(--foreground-secondary)] text-xs ml-2">
                      {c.nome} — {c.entidade} {c.ano && `(${c.ano})`}
                    </p>
                  ))}
                </div>
              )}
              {formData.seguroProfissional && (
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">{tp.summary_insurance}</span>
                  <span className="text-green-400">
                    {tp.summary_yes}
                    {formData.seguradora ? ` (${formData.seguradora})` : ""}
                  </span>
                </div>
              )}
              {formData.emergencias24h && (
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">{tp.summary_emergencies}</span>
                  <span className="text-green-400">{tp.summary_yes}</span>
                </div>
              )}
              {formData.documentos.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)]">{tp.summary_documents}</span>
                  <span className="text-[var(--foreground)]">
                    {formData.documentos.length} {tp.summary_documents_suffix}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plano */}
        <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 p-6 mb-6 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="text-[var(--gold)]" size={24} />
            <h3 className="text-lg font-medium text-[var(--foreground)]">
              {tp.subscription_title}
            </h3>
          </div>
          <div className="space-y-2 text-sm text-[var(--foreground-secondary)]">
            <p>{tp.subscription_benefit_1}</p>
            <p>{tp.subscription_benefit_2}</p>
            <p>{tp.subscription_benefit_3}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--gold)]/20">
            <span className="text-2xl font-bold text-[var(--gold)]">{tp.subscription_price}</span>
            <span className="text-[var(--foreground-muted)]">{tp.subscription_period}</span>
          </div>
        </div>

        {/* Termos Obrigatorios */}
        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="aceitaTermos"
              checked={formData.aceitaTermos}
              onChange={handleInputChange}
              className="w-4 h-4 mt-0.5 accent-[#C5A059]"
            />
            <span className="text-sm text-[var(--foreground-secondary)]">{tp.terms_accept}</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="declaracaoVeracidade"
              checked={formData.declaracaoVeracidade}
              onChange={handleInputChange}
              className="w-4 h-4 mt-0.5 accent-[#C5A059]"
            />
            <span className="text-sm text-[var(--foreground-secondary)]">
              {tp.terms_truthfulness}
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="autorizaVerificacao"
              checked={formData.autorizaVerificacao}
              onChange={handleInputChange}
              className="w-4 h-4 mt-0.5 accent-[#C5A059]"
            />
            <span className="text-sm text-[var(--foreground-secondary)]">
              {tp.terms_verification}
            </span>
          </label>
        </div>

        {/* Info */}
        <p className="text-xs text-[var(--foreground-muted)] mb-6">{tp.info_after_payment}</p>

        {/* Botoes */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft size={18} />
            {tp.btn_back}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isStep4Valid}
            className="inline-flex items-center gap-2 bg-[var(--gold)] text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {tp.btn_processing}
              </>
            ) : (
              <>
                {tp.btn_subscribe}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

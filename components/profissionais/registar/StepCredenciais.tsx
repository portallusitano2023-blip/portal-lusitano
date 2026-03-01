"use client";

import {
  Globe,
  Instagram,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Facebook,
  Linkedin,
} from "lucide-react";
import type { StepCredenciaisProps } from "./types";

export default function StepCredenciais({
  formData,
  tp,
  styles,
  novaCertificacao,
  setNovaCertificacao,
  associacaoInput,
  setAssociacaoInput,
  handleInputChange,
  handleAddCertificacao,
  handleRemoveCertificacao,
  handleAddAssociacao,
  handleRemoveAssociacao,
  handleToggleDia,
  handleDocumentoUpload,
  handleRemoveDocumento,
  setFormData,
  DIAS_SEMANA,
  isStep3Valid,
  onNext,
  onBack,
}: StepCredenciaisProps) {
  const { inputClass, labelClass, sectionTitleClass } = styles;

  return (
    <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
      <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6 text-center">
        {tp.heading_credentials}
      </h2>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Formacao Academica */}
        <div>
          <label className={labelClass}>{tp.field_education}</label>
          <input
            type="text"
            name="formacaoAcademica"
            value={formData.formacaoAcademica}
            onChange={handleInputChange}
            placeholder={tp.field_education_placeholder}
            className={inputClass}
          />
        </div>

        {/* Certificacoes */}
        <div className="pt-4 border-t border-[var(--border)]">
          <span className={sectionTitleClass}>{tp.section_certifications}</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <input
              type="text"
              value={novaCertificacao.nome}
              onChange={(e) => setNovaCertificacao({ ...novaCertificacao, nome: e.target.value })}
              placeholder={tp.field_cert_name_placeholder}
              className={inputClass}
            />
            <input
              type="text"
              value={novaCertificacao.entidade}
              onChange={(e) =>
                setNovaCertificacao({ ...novaCertificacao, entidade: e.target.value })
              }
              placeholder={tp.field_cert_entity_placeholder}
              className={inputClass}
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={novaCertificacao.ano}
                onChange={(e) => setNovaCertificacao({ ...novaCertificacao, ano: e.target.value })}
                placeholder={tp.field_cert_year_placeholder}
                className={`flex-1 ${inputClass}`}
              />
              <button
                type="button"
                onClick={handleAddCertificacao}
                className="px-3 py-2 bg-[var(--gold)] text-black hover:bg-[var(--gold-hover)] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          {formData.certificacoes.length > 0 && (
            <div className="space-y-2">
              {formData.certificacoes.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 bg-[var(--background-card)] border border-[var(--border)] text-sm"
                >
                  <span className="text-[var(--foreground-secondary)]">
                    {cert.nome} — {cert.entidade} {cert.ano && `(${cert.ano})`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCertificacao(i)}
                    className="text-[var(--foreground-muted)] hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Associacoes Profissionais */}
        <div>
          <label className={labelClass}>{tp.field_associations}</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={associacaoInput}
              onChange={(e) => setAssociacaoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddAssociacao();
                }
              }}
              placeholder={tp.field_associations_placeholder}
              className={`flex-1 ${inputClass}`}
            />
            <button
              type="button"
              onClick={handleAddAssociacao}
              className="px-4 py-3 bg-[var(--gold)] text-black text-sm font-medium hover:bg-[var(--gold-hover)] transition-colors"
            >
              {tp.btn_add}
            </button>
          </div>
          {formData.associacoes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.associacoes.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--background-card)] text-sm text-[var(--foreground-secondary)] border border-[var(--border)]"
                >
                  {a}
                  <button
                    type="button"
                    onClick={() => handleRemoveAssociacao(a)}
                    className="text-[var(--foreground-muted)] hover:text-red-400 ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Seguro Profissional */}
        <div className="grid md:grid-cols-2 gap-4 items-end">
          <div className="flex items-center gap-3 py-3">
            <input
              type="checkbox"
              name="seguroProfissional"
              checked={formData.seguroProfissional}
              onChange={handleInputChange}
              id="seguroProfissional"
              className="w-4 h-4 accent-[#C5A059]"
            />
            <label
              htmlFor="seguroProfissional"
              className="text-sm text-[var(--foreground-secondary)]"
            >
              {tp.field_insurance}
            </label>
          </div>
          {formData.seguroProfissional && (
            <div>
              <label className={labelClass}>{tp.field_insurer}</label>
              <input
                type="text"
                name="seguradora"
                value={formData.seguradora}
                onChange={handleInputChange}
                placeholder={tp.field_insurer_placeholder}
                className={inputClass}
              />
            </div>
          )}
        </div>

        {/* Disponibilidade */}
        <div className="pt-4 border-t border-[var(--border)]">
          <span className={sectionTitleClass}>{tp.section_availability}</span>
          <div className="flex flex-wrap gap-2 mb-4">
            {DIAS_SEMANA.map((dia) => (
              <button
                key={dia}
                type="button"
                onClick={() => handleToggleDia(dia)}
                className={`px-3 py-1.5 text-xs border transition-colors ${
                  formData.disponibilidade.dias.includes(dia)
                    ? "bg-[var(--gold)]/20 border-[var(--gold)] text-[var(--gold)]"
                    : "bg-[var(--background-card)] border-[var(--border)] text-[var(--foreground-muted)]"
                }`}
              >
                {dia}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>{tp.field_start_time}</label>
              <input
                type="time"
                value={formData.disponibilidade.horaInicio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    disponibilidade: {
                      ...formData.disponibilidade,
                      horaInicio: e.target.value,
                    },
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{tp.field_end_time}</label>
              <input
                type="time"
                value={formData.disponibilidade.horaFim}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    disponibilidade: { ...formData.disponibilidade, horaFim: e.target.value },
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="emergencias24h"
              checked={formData.emergencias24h}
              onChange={handleInputChange}
              id="emergencias24h"
              className="w-4 h-4 accent-[#C5A059]"
            />
            <label htmlFor="emergencias24h" className="text-sm text-[var(--foreground-secondary)]">
              {tp.field_emergencies}
            </label>
          </div>
        </div>

        {/* Descricao Completa */}
        <div className="pt-4 border-t border-[var(--border)]">
          <label className={labelClass}>
            {tp.field_description}{" "}
            <span className="text-[var(--foreground-muted)]">{tp.field_description_min}</span>
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            placeholder={tp.field_description_placeholder}
            rows={5}
            className={`${inputClass} resize-none`}
          />
          <p
            className={`text-xs mt-1 ${formData.descricao.length >= 100 ? "text-green-400" : "text-[var(--foreground-muted)]"}`}
          >
            {formData.descricao.length}/100 {tp.field_description_count}
          </p>
        </div>

        {/* Redes Sociais */}
        <div className="pt-4 border-t border-[var(--border)]">
          <span className={sectionTitleClass}>{tp.section_online_presence}</span>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{tp.field_website}</label>
              <div className="relative">
                <Globe
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                  size={18}
                />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder={tp.field_website_placeholder}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>{tp.field_instagram}</label>
              <div className="relative">
                <Instagram
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                  size={18}
                />
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder={tp.field_instagram_placeholder}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>{tp.field_facebook}</label>
              <div className="relative">
                <Facebook
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                  size={18}
                />
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder={tp.field_facebook_placeholder}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>{tp.field_linkedin}</label>
              <div className="relative">
                <Linkedin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                  size={18}
                />
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder={tp.field_linkedin_placeholder}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documentos Comprovativos */}
        <div className="pt-4 border-t border-[var(--border)]">
          <span className={sectionTitleClass}>{tp.section_documents}</span>
          <p className="text-xs text-[var(--foreground-muted)] mb-3">{tp.documents_hint}</p>
          {formData.documentos.length < 3 && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] text-sm text-[var(--foreground-secondary)] hover:border-[var(--gold)]/50 hover:text-[var(--foreground)] transition-colors cursor-pointer mb-3">
              <FileText size={16} />
              {tp.btn_select_file}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleDocumentoUpload}
                className="hidden"
              />
            </label>
          )}
          {formData.documentos.length > 0 && (
            <div className="space-y-2">
              {formData.documentos.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 bg-[var(--background-card)] border border-[var(--border)] text-sm"
                >
                  <span className="text-[var(--foreground-secondary)]">
                    <FileText size={14} className="inline mr-2" />
                    {tp.document_label} {i + 1} (
                    {doc.startsWith("data:image") ? tp.document_image : tp.document_pdf})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDocumento(i)}
                    className="text-[var(--foreground-muted)] hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botoes */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft size={18} />
            {tp.btn_back}
          </button>
          <button
            onClick={onNext}
            disabled={!isStep3Valid}
            className="inline-flex items-center gap-2 bg-[var(--gold)] text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tp.btn_continue}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

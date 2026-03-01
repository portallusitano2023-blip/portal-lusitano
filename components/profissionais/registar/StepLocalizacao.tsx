"use client";

import { MapPin, Globe, ArrowRight, ArrowLeft } from "lucide-react";
import { distritos } from "@/components/profissionais/constants";
import type { StepLocalizacaoProps } from "./types";

const distritosOptions = distritos.filter((d) => d !== "Todos");

export default function StepLocalizacao({
  formData,
  tp,
  styles,
  servicoInput,
  setServicoInput,
  handleInputChange,
  handleAddServico,
  handleRemoveServico,
  handleToggleIdioma,
  IDIOMAS_OPCOES,
  isStep2Valid,
  onNext,
  onBack,
}: StepLocalizacaoProps) {
  const { inputClass, labelClass, sectionTitleClass } = styles;

  return (
    <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
      <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6 text-center">
        {tp.heading_location}
      </h2>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Modalidade info banner */}
        <div className="p-3 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-lg text-sm text-[var(--foreground-secondary)]">
          {formData.modalidade === "presencial" && tp.modality_presencial_info}
          {formData.modalidade === "online" && tp.modality_online_info}
          {formData.modalidade === "clinicas_internacionais" && tp.modality_international_info}
        </div>

        {/* Pais (only for online) */}
        {formData.modalidade === "online" && (
          <div>
            <label className={labelClass}>{tp.field_country}</label>
            <div className="relative">
              <Globe
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                size={18}
              />
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                placeholder={tp.field_country_placeholder}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        )}

        {/* Cidade + Distrito (presencial or online) */}
        {formData.modalidade !== "clinicas_internacionais" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{tp.field_city}</label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                  size={18}
                />
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder={tp.field_city_placeholder}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                {formData.modalidade === "presencial"
                  ? tp.field_district_required
                  : tp.field_district}
              </label>
              <select
                name="distrito"
                value={formData.distrito}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">{tp.field_district_placeholder}</option>
                {distritosOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Morada + Codigo Postal (only presencial) */}
        {formData.modalidade === "presencial" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{tp.field_address}</label>
              <input
                type="text"
                name="morada"
                value={formData.morada}
                onChange={handleInputChange}
                placeholder={tp.field_address_placeholder}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{tp.field_postal_code}</label>
              <input
                type="text"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleInputChange}
                placeholder={tp.field_postal_code_placeholder}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* Raio de Servico + Deslocacoes (only presencial) */}
        {formData.modalidade === "presencial" && (
          <div className="grid md:grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelClass}>{tp.field_service_radius}</label>
              <input
                type="number"
                name="raioServico"
                value={formData.raioServico || ""}
                onChange={handleInputChange}
                placeholder={tp.field_service_radius_placeholder}
                min={0}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-3 py-3">
              <input
                type="checkbox"
                name="aceitaDeslocacoes"
                checked={formData.aceitaDeslocacoes}
                onChange={handleInputChange}
                id="aceitaDeslocacoes"
                className="w-4 h-4 accent-[#C5A059]"
              />
              <label
                htmlFor="aceitaDeslocacoes"
                className="text-sm text-[var(--foreground-secondary)]"
              >
                {tp.field_accepts_travel}
              </label>
            </div>
          </div>
        )}

        {/* Servicos Oferecidos */}
        <div className="pt-4 border-t border-[var(--border)]">
          <span className={sectionTitleClass}>{tp.section_services}</span>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={servicoInput}
              onChange={(e) => setServicoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddServico();
                }
              }}
              placeholder={tp.field_service_placeholder}
              className={`flex-1 ${inputClass}`}
            />
            <button
              type="button"
              onClick={handleAddServico}
              className="px-4 py-3 bg-[var(--gold)] text-black text-sm font-medium hover:bg-[var(--gold-hover)] transition-colors"
            >
              {tp.btn_add}
            </button>
          </div>
          {formData.servicos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.servicos.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--background-card)] text-sm text-[var(--foreground-secondary)] border border-[var(--border)]"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveServico(s)}
                    className="text-[var(--foreground-muted)] hover:text-red-400 ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
          {formData.servicos.length === 0 && (
            <p className="text-xs text-[var(--foreground-muted)]">{tp.services_min_hint}</p>
          )}
        </div>

        {/* Preco Medio */}
        <div>
          <label className={labelClass}>{tp.field_average_price}</label>
          <input
            type="text"
            name="precoMedio"
            value={formData.precoMedio}
            onChange={handleInputChange}
            placeholder={tp.field_average_price_placeholder}
            className={inputClass}
          />
        </div>

        {/* Idiomas */}
        <div>
          <label className={labelClass}>{tp.field_languages}</label>
          <div className="flex flex-wrap gap-3">
            {IDIOMAS_OPCOES.map((idioma) => (
              <label key={idioma} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.idiomas.includes(idioma)}
                  onChange={() => handleToggleIdioma(idioma)}
                  className="w-4 h-4 accent-[#C5A059]"
                />
                <span className="text-sm text-[var(--foreground-secondary)]">{idioma}</span>
              </label>
            ))}
          </div>
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
            disabled={!isStep2Valid}
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

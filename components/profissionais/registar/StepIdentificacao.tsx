"use client";

import NextImage from "next/image";
import { Mail, Phone, Camera, X, ArrowRight } from "lucide-react";
import { categorias, modalidades } from "@/components/profissionais/constants";
import type { CategoriaProf } from "@/components/profissionais/types";
import type { StepIdentificacaoProps } from "./types";

const categoriasOptions = categorias.filter((c) => c.id !== "todos") as {
  id: CategoriaProf;
  label: string;
  descricao: string;
}[];

export default function StepIdentificacao({
  formData,
  tp,
  styles,
  fotoPreview,
  handleInputChange,
  handleFotoChange,
  handleRemoveFoto,
  setFormData,
  isStep1Valid,
  onNext,
}: StepIdentificacaoProps) {
  const { inputClass, labelClass } = styles;

  return (
    <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
      <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6 text-center">
        {tp.heading_identity}
      </h2>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Foto de Perfil */}
        <div>
          <label className={labelClass}>{tp.photo_label}</label>
          <div className="flex items-center gap-4">
            {fotoPreview ? (
              <div className="relative">
                <NextImage
                  src={fotoPreview}
                  alt="Preview"
                  width={80}
                  height={80}
                  unoptimized
                  className="w-20 h-20 rounded-xl object-cover border border-[var(--gold)]/30"
                />
                <button
                  type="button"
                  onClick={handleRemoveFoto}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 bg-[var(--background-secondary)] border border-[var(--border)] border-dashed rounded-xl flex items-center justify-center">
                <Camera size={24} className="text-[var(--foreground-muted)]" />
              </div>
            )}
            <div className="flex-1">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] text-sm text-[var(--foreground-secondary)] hover:border-[var(--gold)]/50 hover:text-[var(--foreground)] transition-colors cursor-pointer">
                <Camera size={16} />
                {fotoPreview ? tp.photo_change : tp.photo_choose}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-[var(--foreground-muted)] mt-1">{tp.photo_hint}</p>
            </div>
          </div>
        </div>

        {/* Nome Completo */}
        <div>
          <label htmlFor="nome" className={labelClass}>
            {tp.field_name}
          </label>
          <input
            id="nome"
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder={tp.field_name_placeholder}
            className={inputClass}
          />
        </div>

        {/* Email + Telefone */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              {tp.field_email}
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                size={18}
              />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={tp.field_email_placeholder}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="telefone" className={labelClass}>
              {tp.field_phone}
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                size={18}
              />
              <input
                id="telefone"
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder={tp.field_phone_placeholder}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="categoria" className={labelClass}>
            {tp.field_category}
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="">{tp.field_category_placeholder}</option>
            {categoriasOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} - {c.descricao}
              </option>
            ))}
          </select>
        </div>

        {/* Modalidade de Servico */}
        <div>
          <label className={labelClass}>{tp.field_modality}</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {modalidades.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, modalidade: m.id }))}
                className={`p-3 border rounded-lg text-left transition-all ${
                  formData.modalidade === m.id
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--foreground)]"
                    : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--foreground-muted)]"
                }`}
              >
                <span className="block text-sm font-medium">{m.label}</span>
                <span className="block text-xs mt-1 opacity-70">{m.descricao}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Especialidade + Anos Experiencia */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="especialidade" className={labelClass}>
              {tp.field_specialty}
            </label>
            <input
              id="especialidade"
              type="text"
              name="especialidade"
              value={formData.especialidade}
              onChange={handleInputChange}
              placeholder={tp.field_specialty_placeholder}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="anosExperiencia" className={labelClass}>
              {tp.field_experience}
            </label>
            <input
              id="anosExperiencia"
              type="number"
              name="anosExperiencia"
              value={formData.anosExperiencia || ""}
              onChange={handleInputChange}
              placeholder={tp.field_experience_placeholder}
              min={1}
              className={inputClass}
            />
          </div>
        </div>

        {/* Botao Continuar */}
        <div className="flex justify-end pt-6">
          <button
            onClick={onNext}
            disabled={!isStep1Valid}
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

"use client";

import { Info } from "lucide-react";
import type { StepProps } from "@/components/vender-cavalo/types";
import { pelagens } from "@/components/vender-cavalo/data";
import { useLanguage } from "@/context/LanguageContext";

export default function StepIdentificacao({ formData, updateField }: StepProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[var(--gold)] rounded-full flex items-center justify-center text-black text-sm font-bold">
          2
        </span>
        {t.vender_cavalo.step_id_title}
      </h2>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-300">{t.vender_cavalo.apsl_notice}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nome" className="block text-sm text-[var(--foreground-secondary)] mb-1">
              {t.vender_cavalo.horse_name} *
            </label>
            <input
              id="nome"
              type="text"
              required
              minLength={2}
              value={formData.nome}
              onChange={(e) => updateField("nome", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_horse_name}
            />
          </div>
          <div>
            <label
              htmlFor="nome_registo"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.registration_name} *
            </label>
            <input
              id="nome_registo"
              type="text"
              required
              minLength={2}
              value={formData.nome_registo}
              onChange={(e) => updateField("nome_registo", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_registration_name}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="numero_registo"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.registration_number} *
            </label>
            <input
              id="numero_registo"
              type="text"
              required
              value={formData.numero_registo}
              onChange={(e) => updateField("numero_registo", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_registration_number}
            />
          </div>
          <div>
            <label
              htmlFor="microchip"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.microchip_number} *
            </label>
            <input
              id="microchip"
              type="text"
              required
              minLength={15}
              maxLength={15}
              pattern="\d{15}"
              value={formData.microchip}
              onChange={(e) => updateField("microchip", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_microchip}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="passaporte_equino"
            className="block text-sm text-[var(--foreground-secondary)] mb-1"
          >
            {t.vender_cavalo.passport_number}
          </label>
          <input
            id="passaporte_equino"
            type="text"
            value={formData.passaporte_equino}
            onChange={(e) => updateField("passaporte_equino", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            placeholder={t.vender_cavalo.placeholder_passport}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="data_nascimento"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.birth_date} *
            </label>
            <input
              id="data_nascimento"
              type="date"
              required
              value={formData.data_nascimento}
              onChange={(e) => updateField("data_nascimento", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            />
          </div>
          <div>
            <label htmlFor="sexo" className="block text-sm text-[var(--foreground-secondary)] mb-1">
              {t.vender_cavalo.sex} *
            </label>
            <select
              id="sexo"
              required
              value={formData.sexo}
              onChange={(e) => updateField("sexo", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">{t.vender_cavalo.select}</option>
              <option value="Garanhão">{t.vender_cavalo.stallion}</option>
              <option value="Égua">{t.vender_cavalo.mare}</option>
              <option value="Castrado">{t.vender_cavalo.gelding}</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="pelagem"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.coat} *
            </label>
            <select
              id="pelagem"
              value={formData.pelagem}
              onChange={(e) => updateField("pelagem", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">{t.vender_cavalo.select}</option>
              {pelagens.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="altura" className="block text-sm text-[var(--foreground-secondary)] mb-1">
            {t.vender_cavalo.height}
          </label>
          <input
            id="altura"
            type="number"
            value={formData.altura}
            onChange={(e) => updateField("altura", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            placeholder={t.vender_cavalo.placeholder_height}
            min={140}
            max={180}
          />
        </div>
      </div>
    </div>
  );
}

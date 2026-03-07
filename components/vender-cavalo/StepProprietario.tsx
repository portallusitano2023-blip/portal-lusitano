"use client";

import type { StepProps } from "@/components/vender-cavalo/types";
import { tiposProprietario, paisesOpcoes } from "@/components/vender-cavalo/data";
import { useLanguage } from "@/context/LanguageContext";

export default function StepProprietario({ formData, updateField }: StepProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[var(--gold)] rounded-full flex items-center justify-center text-black text-sm font-bold">
          1
        </span>
        {t.vender_cavalo.step_owner_title}
      </h2>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="tipo_proprietario"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              Tipo de Vendedor *
            </label>
            <select
              id="tipo_proprietario"
              required
              value={formData.tipo_proprietario}
              onChange={(e) => updateField("tipo_proprietario", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">{t.vender_cavalo.select}</option>
              {tiposProprietario.map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="pais_proprietario"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              País de Residência *
            </label>
            <select
              id="pais_proprietario"
              required
              value={formData.pais_proprietario}
              onChange={(e) => updateField("pais_proprietario", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">{t.vender_cavalo.select}</option>
              {paisesOpcoes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="proprietario_nome"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.full_name} *
            </label>
            <input
              id="proprietario_nome"
              type="text"
              required
              minLength={3}
              value={formData.proprietario_nome}
              onChange={(e) => updateField("proprietario_nome", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_full_name}
            />
          </div>
          <div>
            <label
              htmlFor="proprietario_nif"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.nif}
              <span className="text-[var(--foreground-muted)] text-xs ml-1">(opcional)</span>
            </label>
            <input
              id="proprietario_nif"
              type="text"
              minLength={9}
              maxLength={9}
              value={formData.proprietario_nif}
              onChange={(e) => updateField("proprietario_nif", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_nif}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="proprietario_email"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.email} *
            </label>
            <input
              id="proprietario_email"
              type="email"
              required
              value={formData.proprietario_email}
              onChange={(e) => updateField("proprietario_email", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_email}
            />
          </div>
          <div>
            <label
              htmlFor="proprietario_telefone"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.phone} *
            </label>
            <input
              id="proprietario_telefone"
              type="tel"
              required
              value={formData.proprietario_telefone}
              onChange={(e) => updateField("proprietario_telefone", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_phone}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="proprietario_morada"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              {t.vender_cavalo.address}
            </label>
            <input
              id="proprietario_morada"
              type="text"
              value={formData.proprietario_morada}
              onChange={(e) => updateField("proprietario_morada", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_address}
            />
          </div>
          <div>
            <label
              htmlFor="proprietario_whatsapp"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              WhatsApp
              <span className="text-[var(--foreground-muted)] text-xs ml-1">(se diferente do telefone)</span>
            </label>
            <input
              id="proprietario_whatsapp"
              type="tel"
              value={formData.proprietario_whatsapp}
              onChange={(e) => updateField("proprietario_whatsapp", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="+351 9XX XXX XXX"
            />
          </div>
        </div>

        {(formData.tipo_proprietario === "Coudelaria" || formData.tipo_proprietario === "Clube / Escola de Equitação") && (
          <div>
            <label
              htmlFor="website_coudelaria"
              className="block text-sm text-[var(--foreground-secondary)] mb-1"
            >
              Website da Coudelaria / Escola
              <span className="text-[var(--foreground-muted)] text-xs ml-1">(opcional)</span>
            </label>
            <input
              id="website_coudelaria"
              type="url"
              value={formData.website_coudelaria}
              onChange={(e) => updateField("website_coudelaria", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="https://www.coudelaria.pt"
            />
          </div>
        )}
      </div>
    </div>
  );
}

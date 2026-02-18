"use client";

import type { StepProps } from "@/components/vender-cavalo/types";
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
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              {t.vender_cavalo.full_name} *
            </label>
            <input
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
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              {t.vender_cavalo.nif} *
            </label>
            <input
              type="text"
              required
              minLength={9}
              maxLength={9}
              pattern="\d{9}"
              value={formData.proprietario_nif}
              onChange={(e) => updateField("proprietario_nif", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_nif}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              {t.vender_cavalo.email} *
            </label>
            <input
              type="email"
              required
              value={formData.proprietario_email}
              onChange={(e) => updateField("proprietario_email", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_email}
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              {t.vender_cavalo.phone} *
            </label>
            <input
              type="tel"
              required
              value={formData.proprietario_telefone}
              onChange={(e) => updateField("proprietario_telefone", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_phone}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
            {t.vender_cavalo.address}
          </label>
          <input
            type="text"
            value={formData.proprietario_morada}
            onChange={(e) => updateField("proprietario_morada", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            placeholder={t.vender_cavalo.placeholder_address}
          />
        </div>
      </div>
    </div>
  );
}

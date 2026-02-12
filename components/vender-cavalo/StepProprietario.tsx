"use client";

import type { StepProps } from "@/components/vender-cavalo/types";

export default function StepProprietario({ formData, updateField }: StepProps) {
  return (
    <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[var(--gold)] rounded-full flex items-center justify-center text-black text-sm font-bold">
          1
        </span>
        Dados do Proprietário
      </h2>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              minLength={3}
              value={formData.proprietario_nome}
              onChange={(e) => updateField("proprietario_nome", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="Nome completo"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">NIF *</label>
            <input
              type="text"
              required
              minLength={9}
              maxLength={9}
              pattern="\d{9}"
              value={formData.proprietario_nif}
              onChange={(e) => updateField("proprietario_nif", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="123456789"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.proprietario_email}
              onChange={(e) => updateField("proprietario_email", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="email@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Telefone *
            </label>
            <input
              type="tel"
              required
              value={formData.proprietario_telefone}
              onChange={(e) => updateField("proprietario_telefone", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="+351 912 345 678"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--foreground-secondary)] mb-1">Morada</label>
          <input
            type="text"
            value={formData.proprietario_morada}
            onChange={(e) => updateField("proprietario_morada", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            placeholder="Morada completa"
          />
        </div>
      </div>
    </div>
  );
}

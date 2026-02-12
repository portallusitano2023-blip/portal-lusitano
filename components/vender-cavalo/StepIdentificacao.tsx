"use client";

import { Info } from "lucide-react";
import type { StepProps } from "@/components/vender-cavalo/types";
import { pelagens } from "@/components/vender-cavalo/data";

export default function StepIdentificacao({ formData, updateField }: StepProps) {
  return (
    <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[var(--gold)] rounded-full flex items-center justify-center text-black text-sm font-bold">
          2
        </span>
        Identificação do Cavalo
      </h2>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-300">
            Todos os cavalos devem estar registados no Livro Azul da APSL (Associação Portuguesa de
            Criadores do Cavalo Puro Sangue Lusitano).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Nome do Cavalo *
            </label>
            <input
              type="text"
              required
              minLength={2}
              value={formData.nome}
              onChange={(e) => updateField("nome", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="Nome pelo qual é conhecido"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Nome de Registo (Livro Azul) *
            </label>
            <input
              type="text"
              required
              minLength={2}
              value={formData.nome_registo}
              onChange={(e) => updateField("nome_registo", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="Nome oficial no registo"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Número de Registo APSL *
            </label>
            <input
              type="text"
              required
              value={formData.numero_registo}
              onChange={(e) => updateField("numero_registo", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="Ex: PSL-XXXXX"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Número do Microchip *
            </label>
            <input
              type="text"
              required
              minLength={15}
              maxLength={15}
              pattern="\d{15}"
              value={formData.microchip}
              onChange={(e) => updateField("microchip", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder="15 dígitos"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
            Número do Passaporte Equino
          </label>
          <input
            type="text"
            value={formData.passaporte_equino}
            onChange={(e) => updateField("passaporte_equino", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            placeholder="Número do documento"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Data de Nascimento *
            </label>
            <input
              type="date"
              required
              value={formData.data_nascimento}
              onChange={(e) => updateField("data_nascimento", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">Sexo *</label>
            <select
              required
              value={formData.sexo}
              onChange={(e) => updateField("sexo", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">Selecionar</option>
              <option value="Garanhão">Garanhão</option>
              <option value="Égua">Égua</option>
              <option value="Castrado">Castrado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              Pelagem *
            </label>
            <select
              value={formData.pelagem}
              onChange={(e) => updateField("pelagem", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">Selecionar</option>
              {pelagens.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
            Altura (cm)
          </label>
          <input
            type="number"
            value={formData.altura}
            onChange={(e) => updateField("altura", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            placeholder="Ex: 162"
            min={140}
            max={180}
          />
        </div>
      </div>
    </div>
  );
}

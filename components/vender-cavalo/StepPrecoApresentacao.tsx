"use client";

import { Euro, Camera, X, Plus } from "lucide-react";
import type { StepProps } from "@/components/vender-cavalo/types";
import { disponibilidades, MAX_IMAGES } from "@/components/vender-cavalo/data";
import { useLanguage } from "@/context/LanguageContext";

interface StepPrecoApresentacaoProps extends StepProps {
  imagens: File[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export default function StepPrecoApresentacao({
  formData,
  updateField,
  imagens,
  onImageUpload,
  onRemoveImage,
}: StepPrecoApresentacaoProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[var(--gold)] rounded-full flex items-center justify-center text-black text-sm font-bold">
          5
        </span>
        {t.vender_cavalo.step_price_title}
      </h2>

      <div className="space-y-6">
        {/* Preço */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              {t.vender_cavalo.price_eur} *
            </label>
            <div className="relative">
              <Euro
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
              />
              <input
                type="number"
                required
                min={0}
                value={formData.preco}
                onChange={(e) => updateField("preco", e.target.value)}
                className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
                placeholder="25000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
              {t.vender_cavalo.location} *
            </label>
            <input
              type="text"
              required
              minLength={3}
              value={formData.localizacao}
              onChange={(e) => updateField("localizacao", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
              placeholder={t.vender_cavalo.placeholder_location}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={formData.negociavel}
              onChange={(e) => updateField("negociavel", e.target.checked)}
              className="w-5 h-5 accent-[var(--gold)]"
            />
            <span className="text-sm">{t.vender_cavalo.price_negotiable}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={formData.aceita_troca}
              onChange={(e) => updateField("aceita_troca", e.target.checked)}
              className="w-5 h-5 accent-[var(--gold)]"
            />
            <span className="text-sm">{t.vender_cavalo.accepts_trade}</span>
          </label>
        </div>

        <div>
          <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
            {t.vender_cavalo.visit_availability}
          </label>
          <select
            value={formData.disponibilidade_visita}
            onChange={(e) => updateField("disponibilidade_visita", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
          >
            <option value="">{t.vender_cavalo.select}</option>
            {disponibilidades.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Fotos */}
        <div className="border-t border-[var(--border)] pt-6">
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-2 flex items-center gap-2">
            <Camera size={18} className="text-[var(--gold)]" />
            {t.vender_cavalo.photos_title} * ({t.vender_cavalo.photos_min_max})
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-4">
            {t.vender_cavalo.photos_tip}
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            {imagens.map((img, i) => (
              <div
                key={i}
                className="aspect-square bg-[var(--background-card)] rounded-lg relative overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onRemoveImage(i)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 touch-manipulation"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {imagens.length < MAX_IMAGES && (
              <label className="aspect-square bg-[var(--background-card)] rounded-lg border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--gold)] transition-colors touch-manipulation">
                <Plus size={24} className="text-[var(--foreground-muted)] mb-1" />
                <span className="text-xs text-[var(--foreground-muted)]">
                  {t.vender_cavalo.add}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onImageUpload}
                />
              </label>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
            {t.vender_cavalo.description} * ({formData.descricao.length}/100{" "}
            {t.vender_cavalo.min_chars})
          </label>
          <textarea
            required
            minLength={100}
            value={formData.descricao}
            onChange={(e) => updateField("descricao", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] h-40 resize-none"
            placeholder={t.vender_cavalo.placeholder_description}
          />
        </div>

        {/* Vídeos */}
        <div>
          <label className="block text-sm text-[var(--foreground-secondary)] mb-1">
            {t.vender_cavalo.video_link}
          </label>
          <input
            type="url"
            value={formData.videos_url}
            onChange={(e) => updateField("videos_url", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>
    </div>
  );
}

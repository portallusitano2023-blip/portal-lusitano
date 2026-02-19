"use client";

import { useState, useCallback } from "react";
import { Euro, Camera, X, Upload, ImagePlus } from "lucide-react";
import type { StepProps } from "@/components/vender-cavalo/types";
import { disponibilidades, MAX_IMAGES, MIN_IMAGES } from "@/components/vender-cavalo/data";
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
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
      if (files.length === 0) return;
      // Simulate a change event using a synthetic-compatible approach
      const dataTransfer = new DataTransfer();
      files.forEach((f) => dataTransfer.items.add(f));
      const input = document.createElement("input");
      input.type = "file";
      Object.defineProperty(input, "files", { value: dataTransfer.files });
      onImageUpload({ target: input } as React.ChangeEvent<HTMLInputElement>);
    },
    [onImageUpload]
  );

  const descLength = formData.descricao.length;
  const descMin = 100;
  const descPercent = Math.min(100, Math.round((descLength / descMin) * 100));
  const descReached = descLength >= descMin;

  return (
    <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[var(--gold)] rounded-full flex items-center justify-center text-black text-sm font-bold">
          5
        </span>
        {t.vender_cavalo.step_price_title}
      </h2>

      <div className="space-y-6">
        {/* Preço + Localização */}
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
                className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
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
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
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
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
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
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
              <Camera size={16} className="text-[var(--gold)]" />
              {t.vender_cavalo.photos_title} *
            </h3>
            <span className="text-xs text-[var(--foreground-muted)]">
              {imagens.length}/{MAX_IMAGES} &middot; {t.vender_cavalo.photos_min_req}
            </span>
          </div>
          <p className="text-xs text-[var(--foreground-muted)] mb-4">
            {t.vender_cavalo.photos_tip}
          </p>

          {/* Progresso de imagens */}
          <div className="h-1 bg-[var(--background-card)] rounded-full mb-4">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                imagens.length >= MIN_IMAGES ? "bg-[var(--gold)]" : "bg-[var(--foreground-muted)]"
              }`}
              style={{ width: `${Math.min(100, (imagens.length / MIN_IMAGES) * 100)}%` }}
            />
          </div>

          {/* Grid de pré-visualizações */}
          {imagens.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
              {imagens.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square bg-[var(--background-card)] rounded-lg relative overflow-hidden group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <button
                    onClick={() => onRemoveImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500/90 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 touch-manipulation"
                    aria-label={`Remover foto ${i + 1}`}
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[8px] uppercase tracking-wider bg-black/60 text-[var(--gold)] px-1.5 py-0.5 rounded">
                      {t.vender_cavalo.photo_main}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Drag & drop area */}
          {imagens.length < MAX_IMAGES && (
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-3 w-full py-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 touch-manipulation ${
                isDragging
                  ? "border-[var(--gold)] bg-[var(--gold)]/5"
                  : "border-[var(--border)] hover:border-[var(--gold)]/50 hover:bg-[var(--background-card)]/50"
              }`}
            >
              <div className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center">
                {isDragging ? (
                  <ImagePlus size={20} className="text-[var(--gold)]" />
                ) : (
                  <Upload size={18} className="text-[var(--foreground-muted)]" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-[var(--foreground-secondary)]">
                  {isDragging ? t.vender_cavalo.drop_here : t.vender_cavalo.drag_or_click}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  JPG, PNG, WEBP &middot;{" "}
                  {t.vender_cavalo.max_images_hint.replace("{max}", String(MAX_IMAGES))}
                </p>
              </div>
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

        {/* Descrição com contador de progresso */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm text-[var(--foreground-secondary)]">
              {t.vender_cavalo.description} *
            </label>
            <span
              className={`text-xs transition-colors ${
                descReached ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"
              }`}
            >
              {descLength}/{descMin}
            </span>
          </div>
          <textarea
            required
            minLength={100}
            value={formData.descricao}
            onChange={(e) => updateField("descricao", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] h-40 resize-none transition-colors"
            placeholder={t.vender_cavalo.placeholder_description}
          />
          {/* Barra de progresso do texto */}
          <div className="mt-1.5 h-0.5 bg-[var(--background-card)] rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                descReached ? "bg-[var(--gold)]" : "bg-[var(--foreground-muted)]/40"
              }`}
              style={{ width: `${descPercent}%` }}
            />
          </div>
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
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>
    </div>
  );
}

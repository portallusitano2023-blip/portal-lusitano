"use client";

import { Euro, Camera, X, Plus } from "lucide-react";
import type { StepProps } from "@/components/vender-cavalo/types";
import { disponibilidades, MAX_IMAGES } from "@/components/vender-cavalo/data";

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
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center text-black text-sm font-bold">
          5
        </span>
        Preço e Apresentação
      </h2>

      <div className="space-y-6">
        {/* Preço */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Preço (€) *</label>
            <div className="relative">
              <Euro size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="number"
                required
                min={0}
                value={formData.preco}
                onChange={(e) => updateField("preco", e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                placeholder="25000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Localização *</label>
            <input
              type="text"
              required
              minLength={3}
              value={formData.localizacao}
              onChange={(e) => updateField("localizacao", e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
              placeholder="Distrito ou localidade"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={formData.negociavel}
              onChange={(e) => updateField("negociavel", e.target.checked)}
              className="w-5 h-5 accent-[#C5A059]"
            />
            <span className="text-sm">Preço negociável</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={formData.aceita_troca}
              onChange={(e) => updateField("aceita_troca", e.target.checked)}
              className="w-5 h-5 accent-[#C5A059]"
            />
            <span className="text-sm">Aceita trocas</span>
          </label>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Disponibilidade para Visitas</label>
          <select
            value={formData.disponibilidade_visita}
            onChange={(e) => updateField("disponibilidade_visita", e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
          >
            <option value="">Selecionar</option>
            {disponibilidades.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Fotos */}
        <div className="border-t border-zinc-800 pt-6">
          <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Camera size={18} className="text-[#C5A059]" />
            Fotografias * (mínimo 3, máximo 10)
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Inclua fotos de diferentes ângulos: perfil, frente, traseira, cascos, e em movimento se
            possível.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            {imagens.map((img, i) => (
              <div
                key={i}
                className="aspect-square bg-zinc-800 rounded-lg relative overflow-hidden"
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
              <label className="aspect-square bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-[#C5A059] transition-colors touch-manipulation">
                <Plus size={24} className="text-zinc-500 mb-1" />
                <span className="text-xs text-zinc-500">Adicionar</span>
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
          <label className="block text-sm text-zinc-400 mb-1">
            Descrição * ({formData.descricao.length}/100 caracteres mínimos)
          </label>
          <textarea
            required
            minLength={100}
            value={formData.descricao}
            onChange={(e) => updateField("descricao", e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] h-40 resize-none"
            placeholder="Descreva o cavalo em detalhe: temperamento, qualidades, razão da venda, características especiais..."
          />
        </div>

        {/* Vídeos */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Link para Vídeos (YouTube/Vimeo)
          </label>
          <input
            type="url"
            value={formData.videos_url}
            onChange={(e) => updateField("videos_url", e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>
    </div>
  );
}

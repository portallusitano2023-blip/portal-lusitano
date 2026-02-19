"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { ChevronDown } from "lucide-react";
import { Product } from "@/types/product";

const PLACEHOLDER_IMAGE = "/placeholder-product.svg";

export default function ProductDisplay({ product }: { product: Product }) {
  const firstImage = product.images[0]?.url || PLACEHOLDER_IMAGE;
  const firstVariant = product.variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState(firstVariant?.id || "");
  // Tracks manual thumbnail clicks — null means "follow active variant"
  const [manualImage, setManualImage] = useState<string | null>(null);

  // Preload all variant images on mount so switching is instant
  useEffect(() => {
    product.variants.forEach((v) => {
      if (v.image?.url) {
        const img = new window.Image();
        img.src = v.image.url;
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activeVariant = product.variants.find((v) => v.id === selectedVariantId) || firstVariant;

  // Derive display image synchronously — no extra render needed
  // Priority: manual thumbnail click > variant-specific image > first product image
  const displayImage = manualImage || activeVariant?.image?.url || firstImage;

  // When user picks a different variant, clear manual override so variant image takes over
  const handleVariantChange = (newId: string) => {
    setSelectedVariantId(newId);
    setManualImage(null);
  };

  const isAvailable = activeVariant?.availableForSale || false;
  const price = Number(activeVariant?.price?.amount || 0).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
      {/* --- COLUNA DA ESQUERDA: GALERIA --- */}
      <div className="space-y-6">
        <div className="aspect-[4/5] w-full bg-[var(--background-secondary)] border border-[var(--border)] overflow-hidden relative group">
          <Image
            key={displayImage}
            src={displayImage}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105 animate-[fadeIn_0.3s_ease-out]"
            priority
          />
        </div>

        {/* Miniaturas */}
        {product.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setManualImage(img.url)}
                aria-label={`Ver imagem ${index + 1} de ${product.title}`}
                className={`w-20 h-24 flex-shrink-0 border transition-all relative ${displayImage === img.url ? "border-[var(--gold)] opacity-100" : "border-transparent opacity-50 hover:opacity-100"}`}
              >
                <Image
                  src={img.url}
                  alt={`${product.title} - imagem ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- COLUNA DA DIREITA: DETALHES --- */}
      <div className="flex flex-col justify-center pt-8 md:pt-0">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-6">
          Coleção Heritage
        </span>

        <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-6 leading-tight">
          {product.title}
        </h1>

        <div className="text-2xl font-serif text-[var(--foreground-secondary)] mb-8 border-b border-[var(--border)] pb-8">
          {price} <span className="text-sm text-[var(--foreground-muted)] ml-1">EUR</span>
        </div>

        {/* MENU DESDOBRÁVEL (DROPDOWN) */}
        {product.variants.length > 1 && (
          <div className="mb-8">
            <label
              htmlFor="variant-select"
              className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mb-4 block"
            >
              Modelo
            </label>

            <div className="relative w-full max-w-xs">
              <select
                id="variant-select"
                value={selectedVariantId}
                onChange={(e) => handleVariantChange(e.target.value)}
                className="w-full appearance-none bg-transparent border border-[var(--border)] text-[var(--foreground)] py-4 pl-4 pr-12 font-serif text-sm focus:border-[var(--gold)] focus:outline-none transition-colors cursor-pointer uppercase tracking-wider rounded-none"
              >
                {product.variants.map((variant) => (
                  <option
                    key={variant.id}
                    value={variant.id}
                    className="bg-[var(--background-elevated)] text-[var(--foreground-secondary)] py-2"
                  >
                    {variant.title}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
                size={16}
              />
            </div>
          </div>
        )}

        <p className="text-[var(--foreground-secondary)] font-serif leading-loose mb-12">
          &ldquo;Produção artesanal sob encomenda. Cada peça é impressa individualmente com a mais
          alta qualidade, unindo a tradição equestre Lusitana ao design contemporâneo.&rdquo;
        </p>

        {/* Botão de Compra */}
        <div className="mb-8">
          {activeVariant ? (
            <AddToCartButton variantId={activeVariant.id} available={isAvailable} />
          ) : (
            <div className="w-full py-6 text-center text-xs uppercase tracking-[0.3em] bg-[var(--background-secondary)] text-[var(--foreground-secondary)] border border-[var(--border)]">
              Indisponível
            </div>
          )}
        </div>

        <div className="space-y-4 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-[var(--gold)] rounded-full"></div>
            <span>Entrega estimada: 5-15 dias úteis</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-[var(--gold)] rounded-full"></div>
            <span>Embalagem Exclusiva Portal Lusitano</span>
          </div>
        </div>
      </div>
    </div>
  );
}

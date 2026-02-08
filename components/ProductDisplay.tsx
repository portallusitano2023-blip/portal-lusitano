"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { ChevronDown } from "lucide-react";

interface ProductImage {
  url: string;
  altText?: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode?: string };
  availableForSale: boolean;
  image?: ProductImage;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export default function ProductDisplay({ product }: { product: Product }) {
  // 1. Estados iniciais
  const [selectedImage, setSelectedImage] = useState(product.images[0]?.url);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id);

  // Encontra a variante ativa com base na escolha
  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  // --- NOVO: ATUALIZAR IMAGEM AUTOMATICAMENTE ---
  // Sempre que a variante muda (activeVariant), verificamos se ela tem uma imagem específica.
  // Se tiver, mudamos a imagem principal para essa.
  useEffect(() => {
    if (activeVariant?.image?.url) {
      setSelectedImage(activeVariant.image.url); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [activeVariant]); // Este "listener" corre sempre que activeVariant muda
  // ----------------------------------------------

  const isAvailable = activeVariant?.availableForSale || false;
  const price = Number(activeVariant?.price?.amount || 0).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
      {/* --- COLUNA DA ESQUERDA: GALERIA --- */}
      <div className="space-y-6">
        <div className="aspect-[4/5] w-full bg-[#0a0a0a] border border-zinc-900 overflow-hidden relative group">
          <Image
            src={selectedImage}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Miniaturas */}
        {product.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img.url)}
                aria-label={`Ver imagem ${index + 1} de ${product.title}`}
                className={`w-20 h-24 flex-shrink-0 border transition-all relative ${selectedImage === img.url ? "border-[#C5A059] opacity-100" : "border-transparent opacity-50 hover:opacity-100"}`}
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
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-6">
          Coleção Heritage
        </span>

        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
          {product.title}
        </h1>

        <div className="text-2xl font-serif text-zinc-300 mb-8 border-b border-white/10 pb-8">
          {price} <span className="text-sm text-zinc-500 ml-1">EUR</span>
        </div>

        {/* MENU DESDOBRÁVEL (DROPDOWN) */}
        {product.variants.length > 1 && (
          <div className="mb-8">
            <label
              htmlFor="variant-select"
              className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 block"
            >
              Modelo
            </label>

            <div className="relative w-full max-w-xs">
              <select
                id="variant-select"
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full appearance-none bg-transparent border border-zinc-800 text-white py-4 pl-4 pr-12 font-serif text-sm focus:border-[#C5A059] focus:outline-none transition-colors cursor-pointer uppercase tracking-wider rounded-none"
              >
                {product.variants.map((variant) => (
                  <option
                    key={variant.id}
                    value={variant.id}
                    className="bg-[#1a1a1a] text-zinc-300 py-2"
                  >
                    {variant.title}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        )}

        <p className="text-zinc-400 font-serif leading-loose mb-12">
          &ldquo;Uma peça desenhada para perdurar. A união entre a funcionalidade equestre e a
          estética intemporal.&rdquo;
        </p>

        {/* Botão de Compra */}
        <div className="mb-8">
          <AddToCartButton variantId={activeVariant.id} available={isAvailable} />
        </div>

        <div className="space-y-4 text-[10px] uppercase tracking-widest text-zinc-600">
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-[#C5A059] rounded-full"></div>
            <span>Envio Premium em 24/48h</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-[#C5A059] rounded-full"></div>
            <span>Embalagem Exclusiva Portal Lusitano</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Check, ChevronRight } from "lucide-react";

export default function ProductDisplay({ product }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Força a seleção da primeira variante assim que o produto carrega
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return;
    setIsAdding(true);
    try {
      await addItem(selectedVariant.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  // Se ainda não selecionou a variante, mostra um loading discreto
  if (!selectedVariant) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
      <div className="relative group">
        <div className="aspect-[4/5] bg-zinc-900 border border-zinc-800 overflow-hidden relative">
          <img
            src={selectedVariant?.image?.url || product?.images?.[0]?.url || ""}
            alt={product?.title}
            className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <h1 className="text-4xl md:text-6xl font-serif italic text-white mb-4 leading-tight">
          {product?.title}
        </h1>
        <p className="text-2xl font-serif text-[#C5A059] mb-10">
          {Number(selectedVariant?.price?.amount || 0).toFixed(2)} €
        </p>

        <div className="space-y-10 border-t border-zinc-900 pt-10">
          {product?.variants?.length > 1 && (
            <div className="grid grid-cols-2 gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-4 text-[10px] uppercase tracking-widest border transition-all ${
                    selectedVariant.id === variant.id ? "border-[#C5A059] text-white bg-[#C5A059]/5" : "border-zinc-800 text-zinc-500"
                  }`}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-white text-black py-6 font-bold uppercase text-[10px] tracking-[0.4em] transition-all hover:bg-[#C5A059]"
          >
            {isAdding ? "A Adicionar..." : "Adicionar ao Saco"}
          </button>
        </div>
      </div>
    </div>
  );
}
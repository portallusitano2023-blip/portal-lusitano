// @ts-nocheck
"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductForm({ variants }) {
  const availableVariants = variants.filter(v => v.availableForSale);
  const [selectedVariant, setSelectedVariant] = useState(availableVariants[0] || null);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();

  async function handleAddToCart() {
    if (!selectedVariant) return;
    setLoading(true);
    // Adiciona e abre a gaveta
    await addItem(selectedVariant.id);
    setLoading(false);
  }

  if (availableVariants.length === 0) {
    return (
      <div className="py-6 text-center border border-zinc-800 bg-zinc-900/50 text-zinc-500 text-xs font-bold uppercase tracking-widest">
        Esgotado Temporariamente
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Seletor */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4">Selecione o Tamanho</h3>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => {
            const isSelected = selectedVariant?.id === variant.id;
            const isAvailable = variant.availableForSale;
            return (
              <button key={variant.id} onClick={() => isAvailable && setSelectedVariant(variant)} disabled={!isAvailable}
                className={`h-12 min-w-[3rem] px-4 border text-xs font-bold transition-all duration-300 ${isSelected ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" : isAvailable ? "text-zinc-400 border-zinc-800 hover:border-[#C5A059] hover:text-[#C5A059]" : "bg-zinc-900 text-zinc-700 border-zinc-900 cursor-not-allowed line-through"}`}>
                {variant.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botão */}
      <button onClick={handleAddToCart} disabled={loading || !selectedVariant} className="w-full py-6 bg-[#C5A059] text-black text-xs uppercase font-bold tracking-[0.3em] hover:bg-white transition-all duration-500">
        {loading ? (
           <span className="flex items-center justify-center gap-2"><span className="w-2 h-2 bg-black rounded-full animate-ping"></span> A Processar...</span>
        ) : (
           `Adicionar ${selectedVariant.title} ao Saco`
        )}
      </button>
      
      <p className="text-[9px] text-center text-zinc-600 uppercase tracking-widest">
        Envio Global Expresso • Pagamento Seguro
      </p>
    </div>
  );
}
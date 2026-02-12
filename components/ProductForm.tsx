"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string };
}

export default function ProductForm({ variants }: { variants: Variant[] }) {
  const availableVariants = variants.filter((v: Variant) => v.availableForSale);
  const [selectedVariant, setSelectedVariant] = useState(availableVariants[0] || null);
  const [loading, setLoading] = useState(false);
  const { addItemToCart } = useCart();

  async function handleAddToCart() {
    if (!selectedVariant) return;
    setLoading(true);
    // Adiciona e abre a gaveta
    await addItemToCart(selectedVariant.id, 1);
    setLoading(false);
  }

  if (availableVariants.length === 0) {
    return (
      <div className="py-6 text-center border border-[var(--border)] bg-[var(--background-secondary)]/50 text-[var(--foreground-muted)] text-xs font-bold uppercase tracking-widest">
        Esgotado Temporariamente
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Seletor */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-muted)] font-bold mb-4">
          Selecione o Tamanho
        </h3>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => {
            const isSelected = selectedVariant?.id === variant.id;
            const isAvailable = variant.availableForSale;
            return (
              <button
                key={variant.id}
                onClick={() => isAvailable && setSelectedVariant(variant)}
                disabled={!isAvailable}
                className={`h-12 min-w-[3rem] px-4 border text-xs font-bold transition-all duration-300 ${isSelected ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] shadow-[0_0_15px_rgba(255,255,255,0.2)]" : isAvailable ? "text-[var(--foreground-secondary)] border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)]" : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] border-[var(--background-secondary)] cursor-not-allowed line-through"}`}
              >
                {variant.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botão */}
      <button
        onClick={handleAddToCart}
        disabled={loading || !selectedVariant}
        className="w-full py-6 bg-[var(--gold)] text-black text-xs uppercase font-bold tracking-[0.3em] hover:bg-[var(--foreground)] transition-all duration-500"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full animate-ping"></span> A Processar...
          </span>
        ) : (
          `Adicionar ${selectedVariant.title} ao Saco`
        )}
      </button>

      <p className="text-[9px] text-center text-[var(--foreground-muted)] uppercase tracking-widest">
        Envio Global Expresso • Pagamento Seguro
      </p>
    </div>
  );
}

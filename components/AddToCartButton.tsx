"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { Loader2 } from "lucide-react";

// Module-level constant — not recreated on every render
const buttonText = {
  pt: {
    add: "Adicionar ao Saco",
    adding: "A Adicionar...",
    sold_out: "Esgotado",
    error: "Erro ao adicionar. Tente novamente.",
  },
  en: {
    add: "Add to Bag",
    adding: "Adding...",
    sold_out: "Sold Out",
    error: "Error adding to bag. Try again.",
  },
  es: {
    add: "Anadir a la Bolsa",
    adding: "Anadiendo...",
    sold_out: "Agotado",
    error: "Error al anadir. Intente de nuevo.",
  },
};

interface AddToCartProps {
  variantId: string;
  available: boolean;
  productTitle?: string;
  productImage?: string;
  productPrice?: string;
  variantTitle?: string;
}

export default function AddToCartButton({
  variantId,
  available,
  productTitle,
  productImage,
  productPrice,
  variantTitle,
}: AddToCartProps) {
  const { addItemToCart } = useCart();
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const t = buttonText[language];

  async function handleAddToCart() {
    if (!variantId) {
      showToast("error", "ERRO: O botão não recebeu o ID do produto. Verifica o ProductDisplay.");
      return;
    }

    if (!available) {
      showToast("error", "Este produto está marcado como esgotado.");
      return;
    }

    setLoading(true);

    try {
      // Passa metadata para UI optimista — item aparece no drawer imediatamente
      const meta = productTitle
        ? {
            title: productTitle,
            image: productImage || "",
            price: productPrice || "0",
            variantTitle,
          }
        : undefined;
      await addItemToCart(variantId, 1, meta);
    } catch {
      showToast("error", t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!available || loading}
      aria-busy={loading}
      className={`
        group relative block w-full py-6 text-center text-xs uppercase font-bold tracking-[0.3em]
        transition-all duration-500 border
        ${
          available
            ? "bg-[var(--gold)] text-black border-[var(--gold)] hover:bg-[var(--foreground)] hover:text-black hover:border-[var(--foreground)]"
            : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)] border-[var(--border)] cursor-not-allowed"
        }
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            {t.adding}
          </>
        ) : available ? (
          t.add
        ) : (
          t.sold_out
        )}
      </span>
    </button>
  );
}

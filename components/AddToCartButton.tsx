"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { Loader2 } from "lucide-react";

export default function AddToCartButton({
  variantId,
  available,
}: {
  variantId: string;
  available: boolean;
}) {
  const { addItemToCart, openCart } = useCart();
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const buttonText = {
    pt: { add: "Adicionar ao Saco", adding: "A Adicionar...", sold_out: "Esgotado" },
    en: { add: "Add to Bag", adding: "Adding...", sold_out: "Sold Out" },
    es: { add: "Anadir a la Bolsa", adding: "Anadiendo...", sold_out: "Agotado" },
  };

  const t = buttonText[language];

  async function handleAddToCart() {
    // 1. VERIFICAÇÃO DE DIAGNÓSTICO
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
      await addItemToCart(variantId, 1);

      // 3. SUCESSO
      openCart();
    } catch (error) {
      // 4. ERRO DO SHOPIFY
      // Shopify error silenced
      showToast(
        "error",
        "Não foi possível conectar ao Shopify. Verifica a consola (F12) para detalhes."
      );
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

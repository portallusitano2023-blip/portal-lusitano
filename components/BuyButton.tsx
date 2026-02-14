"use client";

import { useState } from "react";

interface BuyButtonProps {
  variantId: string;
  available: boolean;
}

export default function BuyButton({ variantId, available }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  function handleBuy() {
    if (!available || !variantId) return;
    setLoading(true);

    try {
      // 1. O ID vem do Shopify assim: "gid://shopify/ProductVariant/4455667788"
      // Nós precisamos apenas do número: "4455667788"
      const numericId = variantId.split("/").pop();

      if (!numericId) {
        throw new Error("ID do produto inválido");
      }

      // 2. Construímos o link direto para o Checkout do Shopify
      // Formato: /cart/{id}:{quantidade}
      const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
      if (!shopifyDomain) {
        throw new Error("Shopify domain não configurado");
      }
      const checkoutUrl = `https://${shopifyDomain}/cart/${numericId}:1`;

      // 3. Redirecionamos o utilizador
      window.location.href = checkoutUrl;
    } catch (_error) {
      // Processing error silenced
      alert("Erro ao iniciar compra. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={!available || loading}
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
            <span className="animate-spin h-3 w-3 border-2 border-black border-t-transparent rounded-full"></span>
            A Redirecionar...
          </>
        ) : available ? (
          "Comprar Agora"
        ) : (
          "Esgotado"
        )}
      </span>
    </button>
  );
}

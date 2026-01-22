// @ts-nocheck
"use client"; 

import { useState } from "react";

export default function BuyButton({ variantId, available }) {
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
      const checkoutUrl = `https://irdip0-dq.myshopify.com/cart/${numericId}:1`;

      // 3. Redirecionamos o utilizador
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error("Erro ao processar:", error);
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
        ${available 
          ? 'bg-[#C5A059] text-black border-[#C5A059] hover:bg-white hover:text-black hover:border-white' 
          : 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'}
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <span className="animate-spin h-3 w-3 border-2 border-black border-t-transparent rounded-full"></span>
            A Redirecionar...
          </>
        ) : (
          available ? "Comprar Agora" : "Esgotado"
        )}
      </span>
    </button>
  );
}
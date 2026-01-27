"use client";

// Este ficheiro serve para agrupar todos os contextos (os "cérebros" do site)
// e permitir que o Next.js os use no layout principal.

import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // O LanguageProvider envolve tudo para as traduções funcionarem
    <LanguageProvider>
      {/* O CartProvider fica dentro para gerir o carrinho */}
      <CartProvider>
        {children}
      </CartProvider>
    </LanguageProvider>
  );
}
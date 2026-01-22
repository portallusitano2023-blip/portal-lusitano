"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { createCart, getCart, addToCart, removeFromCart } from "@/lib/shopify";

// Exportamos o contexto básico
export const CartContext = createContext<any>(null);

// Criamos o "atalho" useCart para facilitar a vida aos outros componentes
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const initializeCart = async () => {
      let cartId = localStorage.getItem("shopify_cart_id");
      
      if (cartId) {
        const existingCart = await getCart(cartId);
        if (existingCart) {
          setCart(existingCart);
        } else {
          const newCart = await createCart();
          if (newCart) {
            localStorage.setItem("shopify_cart_id", newCart.id);
            setCart(newCart);
          }
        }
      } else {
        const newCart = await createCart();
        if (newCart) {
          localStorage.setItem("shopify_cart_id", newCart.id);
          setCart(newCart);
        }
      }
    };

    initializeCart();
  }, []);

  const addItem = async (variantId: string) => {
    if (!cart?.id) return;
    const updatedCart = await addToCart(cart.id, variantId);
    setCart(updatedCart);
    setIsCartOpen(true);
  };

  const removeItem = async (lineId: string) => {
    if (!cart?.id) return;
    const updatedCart = await removeFromCart(cart.id, lineId);
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        // Adicionamos os nomes que o CartDrawer está à espera
        isOpen: isCartOpen,
        closeCart: () => setIsCartOpen(false),
        totalQuantity: cart?.totalQuantity || 0,
        checkoutUrl: cart?.checkoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createCart, addToCart, getCart, removeFromCart, updateCartLines } from "@/lib/shopify";

interface CartItem {
  id: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItemToCart: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Ao iniciar, tenta recuperar o carrinho antigo
  useEffect(() => {
    const localCartId = localStorage.getItem("shopify_cart_id");
    if (localCartId) {
      setCartId(localCartId);
      refreshCart(localCartId);
    }
  }, []);

  // Função auxiliar para atualizar os dados visuais
  const refreshCart = async (id: string) => {
    try {
      const cartData = await getCart(id);
      if (cartData) {
        setCheckoutUrl(cartData.checkoutUrl);

        if (cartData.lines) {
          interface CartEdge {
            node: {
              id: string;
              quantity: number;
              merchandise: {
                price: { amount: string };
                product: {
                  title: string;
                  images: { edges: { node: { url: string } }[] };
                };
              };
            };
          }
          const formattedCart = cartData.lines.edges.map((edge: CartEdge) => ({
            id: edge.node.id,
            title: edge.node.merchandise.product.title,
            price: edge.node.merchandise.price.amount,
            image: edge.node.merchandise.product.images.edges[0]?.node.url,
            quantity: edge.node.quantity,
          }));
          setCart(formattedCart);
        }
      }
    } catch {
      // Silently handle cart refresh errors
    }
  };

  // --- A FUNÇÃO "BLINDADA" COM AUTO-REPARAÇÃO ---
  const addItemToCart = async (variantId: string, quantity: number) => {
    let activeId = cartId;
    let result;

    // Passo 1: Se não temos ID, criamos um novo
    if (!activeId) {
      const newCart = await createCart();
      if (newCart) {
        activeId = newCart.id;
        setCartId(newCart.id);
        localStorage.setItem("shopify_cart_id", newCart.id);
      }
    }

    // Passo 2: Tenta adicionar ao carrinho atual
    if (activeId) {
      try {
        result = await addToCart(activeId, variantId, quantity);

        if (!result) {
          throw new Error("Carrinho expirado");
        }

        await refreshCart(activeId);
        setIsCartOpen(true);
      } catch (e) {
        console.log("Carrinho antigo falhou. A criar novo...");

        localStorage.removeItem("shopify_cart_id");
        const retryCart = await createCart();

        if (retryCart) {
          activeId = retryCart.id;
          setCartId(retryCart.id);
          localStorage.setItem("shopify_cart_id", retryCart.id);

          await addToCart(retryCart.id, variantId, quantity);
          await refreshCart(retryCart.id);
          setIsCartOpen(true);
        }
      }
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (cartId) {
      await updateCartLines(cartId, lineId, quantity);
      await refreshCart(cartId);
    }
  };

  const removeLineItem = async (lineId: string) => {
    if (cartId) {
      await removeFromCart(cartId, lineId);
      await refreshCart(cartId);
    }
  };

  // --- AS LINHAS QUE FALTAVAM ---
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  // ------------------------------

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        checkoutUrl,
        isCartOpen,
        openCart, // Agora já está definido aqui em cima!
        closeCart, // E este também!
        addItemToCart,
        removeFromCart: removeLineItem,
        updateQuantity,
        totalQuantity: cart.reduce((acc, item) => acc + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
};

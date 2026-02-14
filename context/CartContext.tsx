"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface CartItem {
  id: string;
  variantId: string;
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

// --- Helper: chamadas ao servidor via API routes ---

async function apiCreateCart() {
  const res = await fetch("/api/cart/create", { method: "POST" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.cart as { id: string; checkoutUrl?: string; totalQuantity?: number } | null;
}

async function apiAddToCart(cartId: string, variantId: string, quantity: number) {
  const res = await fetch("/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, variantId, quantity }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.cart as { id: string; checkoutUrl?: string; totalQuantity?: number } | null;
}

async function apiGetCart(cartId: string) {
  const res = await fetch("/api/cart/get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.cart;
}

async function apiRemoveFromCart(cartId: string, lineId: string) {
  const res = await fetch("/api/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, lineId }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.cart;
}

async function apiUpdateCartLines(cartId: string, lineId: string, quantity: number) {
  const res = await fetch("/api/cart/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, lineId, quantity }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.cart;
}

// --- Provider ---

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Função auxiliar para atualizar os dados visuais do carrinho
  const refreshCart = useCallback(async (id: string) => {
    try {
      const cartData = await apiGetCart(id);
      if (!cartData) {
        // Carrinho expirado ou inválido
        setCart([]);
        setCheckoutUrl(null);
        return false;
      }

      setCheckoutUrl(cartData.checkoutUrl ?? null);

      if (cartData.lines) {
        interface CartEdge {
          node: {
            id: string;
            quantity: number;
            merchandise: {
              id?: string;
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
          variantId: edge.node.merchandise.id || "",
          title: edge.node.merchandise.product.title,
          price: edge.node.merchandise.price.amount,
          image: edge.node.merchandise.product.images.edges[0]?.node.url || "",
          quantity: edge.node.quantity,
        }));
        setCart(formattedCart);
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  // Ao iniciar, tenta recuperar o carrinho antigo
  useEffect(() => {
    let cancelled = false;
    const localCartId = localStorage.getItem("shopify_cart_id");
    if (localCartId) {
      (async () => {
        const valid = await refreshCart(localCartId);
        if (cancelled) return;
        if (valid) {
          setCartId(localCartId);
        } else {
          localStorage.removeItem("shopify_cart_id");
          setCartId(null);
        }
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [refreshCart]);

  // Criar carrinho novo
  const ensureCart = async (): Promise<string | null> => {
    // Usar cartId do state ou localStorage
    let activeId = cartId || localStorage.getItem("shopify_cart_id");

    if (!activeId) {
      const newCart = await apiCreateCart();
      if (!newCart) return null;
      activeId = newCart.id;
      setCartId(activeId);
      localStorage.setItem("shopify_cart_id", activeId);
    }

    return activeId;
  };

  // Adicionar item com auto-reparação
  const addItemToCart = async (variantId: string, quantity: number) => {
    let activeId = await ensureCart();
    if (!activeId) throw new Error("Não foi possível criar carrinho");

    // Tentar adicionar
    let result = await apiAddToCart(activeId, variantId, quantity);

    // Se falhou, carrinho pode estar expirado — criar novo e tentar outra vez
    if (!result) {
      localStorage.removeItem("shopify_cart_id");
      const newCart = await apiCreateCart();
      if (!newCart) throw new Error("Não foi possível criar carrinho");

      activeId = newCart.id;
      setCartId(activeId);
      localStorage.setItem("shopify_cart_id", activeId);

      result = await apiAddToCart(activeId, variantId, quantity);
      if (!result) throw new Error("Não foi possível adicionar ao carrinho");
    }

    await refreshCart(activeId);
    setIsCartOpen(true);
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cartId) return;
    await apiUpdateCartLines(cartId, lineId, quantity);
    await refreshCart(cartId);
  };

  const removeLineItem = async (lineId: string) => {
    if (!cartId) return;
    await apiRemoveFromCart(cartId, lineId);
    await refreshCart(cartId);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        checkoutUrl,
        isCartOpen,
        openCart,
        closeCart,
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

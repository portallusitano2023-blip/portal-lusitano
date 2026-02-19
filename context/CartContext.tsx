"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

interface CartItem {
  id: string;
  variantId: string;
  title: string;
  variantTitle?: string; // e.g. "Tamanho M / Preto" — absent when single-variant ("Default Title")
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
  return data.cart;
}

async function apiAddToCart(cartId: string, variantId: string, quantity: number) {
  const res = await fetch("/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, variantId, quantity }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.cart;
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

// --- Helper: parse cart data from API response ---
interface CartEdge {
  node: {
    id: string;
    quantity: number;
    merchandise: {
      id?: string;
      title?: string; // variant title e.g. "Tamanho M / Preto"
      price: { amount: string };
      product: {
        title: string;
        images: { edges: { node: { url: string } }[] };
      };
    };
  };
}

function parseCartData(cartData: { checkoutUrl?: string; lines?: { edges: CartEdge[] } }): {
  checkoutUrl: string | null;
  items: CartItem[];
} {
  const checkoutUrl = cartData.checkoutUrl ?? null;
  const items =
    cartData.lines?.edges.map((edge: CartEdge) => {
      const variantTitle = edge.node.merchandise.title;
      // Shopify uses "Default Title" for single-variant products — don't show that
      const normalizedVariantTitle =
        variantTitle && variantTitle !== "Default Title" ? variantTitle : undefined;
      return {
        id: edge.node.id,
        variantId: edge.node.merchandise.id || "",
        title: edge.node.merchandise.product.title,
        variantTitle: normalizedVariantTitle,
        price: edge.node.merchandise.price.amount,
        image: edge.node.merchandise.product.images.edges[0]?.node.url || "",
        quantity: edge.node.quantity,
      };
    }) || [];
  return { checkoutUrl, items };
}

// --- Provider ---

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Apply cart data from any API response that includes lines
  const applyCartData = useCallback((cartData: Parameters<typeof parseCartData>[0]) => {
    const { checkoutUrl: url, items } = parseCartData(cartData);
    setCheckoutUrl(url);
    setCart(items);
  }, []);

  // Ao iniciar, tenta recuperar o carrinho antigo
  useEffect(() => {
    let cancelled = false;
    const localCartId = localStorage.getItem("shopify_cart_id");
    if (localCartId) {
      (async () => {
        try {
          const cartData = await apiGetCart(localCartId);
          if (cancelled) return;
          if (cartData?.lines) {
            setCartId(localCartId);
            applyCartData(cartData);
          } else {
            localStorage.removeItem("shopify_cart_id");
            setCartId(null);
          }
        } catch {
          // Network error (timeout, DNS, etc.) — keep localStorage ID so the next
          // cart operation can still use it. Only clear when Shopify confirms it's gone.
          if (!cancelled) setCartId(null);
        }
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [applyCartData]);

  // Criar carrinho novo
  const ensureCart = useCallback(async (): Promise<string | null> => {
    const activeId = cartId || localStorage.getItem("shopify_cart_id");
    if (activeId) return activeId;

    const newCart = await apiCreateCart();
    if (!newCart) return null;
    setCartId(newCart.id);
    localStorage.setItem("shopify_cart_id", newCart.id);
    if (newCart.lines) applyCartData(newCart);
    return newCart.id;
  }, [cartId, applyCartData]);

  // Adicionar item — mutations now return full cart data, no need for refreshCart
  const addItemToCart = useCallback(
    async (variantId: string, quantity: number) => {
      try {
        let activeId = await ensureCart();
        if (!activeId) {
          console.warn("[Cart] Failed to create cart");
          return;
        }

        let result = await apiAddToCart(activeId, variantId, quantity);

        // Se falhou, carrinho pode estar expirado — criar novo e tentar outra vez
        if (!result) {
          localStorage.removeItem("shopify_cart_id");
          const newCart = await apiCreateCart();
          if (!newCart) {
            console.warn("[Cart] Failed to recreate cart");
            return;
          }

          const newId = newCart.id;
          activeId = newId;
          setCartId(newId);
          localStorage.setItem("shopify_cart_id", newId);

          result = await apiAddToCart(newId, variantId, quantity);
          if (!result) {
            console.warn("[Cart] Failed to add item after cart recreation");
            return;
          }
        }

        // Apply cart data directly from mutation response — no second API call needed
        if (result.lines) {
          applyCartData(result);
        }
        setIsCartOpen(true);
      } catch (err) {
        console.warn("[Cart] addItemToCart error:", err);
      }
    },
    [ensureCart, applyCartData]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cartId) return;
      const result = await apiUpdateCartLines(cartId, lineId, quantity);
      if (result?.lines) {
        applyCartData(result);
      }
    },
    [cartId, applyCartData]
  );

  const removeLineItem = useCallback(
    async (lineId: string) => {
      if (!cartId) return;
      const result = await apiRemoveFromCart(cartId, lineId);
      if (result?.lines) {
        applyCartData(result);
      }
    },
    [cartId, applyCartData]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const totalQuantity = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const value = useMemo<CartContextType>(
    () => ({
      cart,
      cartId,
      checkoutUrl,
      isCartOpen,
      openCart,
      closeCart,
      addItemToCart,
      removeFromCart: removeLineItem,
      updateQuantity,
      totalQuantity,
    }),
    [
      cart,
      cartId,
      checkoutUrl,
      isCartOpen,
      openCart,
      closeCart,
      addItemToCart,
      removeLineItem,
      updateQuantity,
      totalQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
};

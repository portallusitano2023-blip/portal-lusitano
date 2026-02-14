"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

/**
 * Hook to track cart abandonment
 *
 * Usage: Add to layout.tsx or any persistent component
 * useCartAbandonment();
 *
 * How it works:
 * 1. Monitors cart state changes
 * 2. If cart has items + user email, track abandonment after 2 min of inactivity
 * 3. Debounced to avoid excessive API calls
 */
export function useCartAbandonment() {
  const { cart, totalQuantity } = useCart();
  const trackingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTrackedRef = useRef<string>("");

  useEffect(() => {
    // Clear any existing timeout
    if (trackingTimeoutRef.current) {
      clearTimeout(trackingTimeoutRef.current);
    }

    // Don't track if cart is empty
    if (cart.length === 0 || totalQuantity === 0) {
      return;
    }

    // Get session ID (or generate one)
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sessionId);
    }

    // Get user email (if logged in or provided)
    const userEmail = localStorage.getItem("user_email") || "";

    // Create unique cart fingerprint to avoid duplicate tracking
    const cartFingerprint = JSON.stringify(cart.map((i) => ({ id: i.id, qty: i.quantity })));

    // If cart hasn't changed, don't track again
    if (cartFingerprint === lastTrackedRef.current) {
      return;
    }

    // Calculate total price from cart items
    const cartTotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    // Track abandonment after 2 minutes of inactivity
    trackingTimeoutRef.current = setTimeout(
      async () => {
        try {
          const response = await fetch("/api/cart/track-abandonment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              sessionId,
              cartItems: cart.map((item) => ({
                variant_id: item.variantId,
                line_id: item.id,
                name: item.title,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
              })),
              cartTotal,
              cartQuantity: totalQuantity,
              utm: {
                source: new URLSearchParams(window.location.search).get("utm_source"),
                medium: new URLSearchParams(window.location.search).get("utm_medium"),
                campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.tracked) {
              lastTrackedRef.current = cartFingerprint;

              // Store recovery token for later use
              if (data.recoveryToken) {
                localStorage.setItem("cart_recovery_token", data.recoveryToken);
              }
            }
          }
        } catch (_error) {
          // Failed to track cart abandonment - silenced
        }
      },
      2 * 60 * 1000
    ); // 2 minutes

    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
    };
  }, [cart, totalQuantity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
    };
  }, []);
}

/**
 * Hook to restore cart from recovery email link
 *
 * Usage: Add to loja page
 * const { recovered } = useCartRecovery();
 *
 * Checks for ?recover=TOKEN in URL and restores cart
 */
export function useCartRecovery() {
  const { addItemToCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recoveryToken = params.get("recover");

    if (!recoveryToken) return;

    (async () => {
      try {
        const response = await fetch(
          `/api/cart/recover?token=${encodeURIComponent(recoveryToken)}`
        );

        if (!response.ok) {
          // Failed to recover cart
          return;
        }

        const data = await response.json();

        if (data.recovered && data.cart) {
          // Restore cart items using variant IDs
          for (const item of data.cart.items) {
            const variantId = item.variant_id || item.product_id;
            if (variantId) {
              await addItemToCart(variantId, item.quantity);
            }
          }

          // Remove token from URL (clean URL)
          const url = new URL(window.location.href);
          url.searchParams.delete("recover");
          window.history.replaceState({}, "", url.toString());
        }
      } catch {}
    })();
  }, [addItemToCart]);

  return { recovered: true };
}

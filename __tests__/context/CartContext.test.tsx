import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CartProvider, useCart } from "@/context/CartContext";
import * as shopify from "@/lib/shopify";

// Mock do módulo Shopify
vi.mock("@/lib/shopify", () => ({
  createCart: vi.fn(),
  addToCart: vi.fn(),
  getCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateCartLines: vi.fn(),
}));

describe("CartContext", () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    // Clear mocks antes de cada teste
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Inicialização", () => {
    it("deve inicializar com carrinho vazio quando não há cartId no localStorage", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.cart).toEqual([]);
      expect(result.current.cartId).toBeNull();
      expect(result.current.totalQuantity).toBe(0);
      expect(result.current.isCartOpen).toBe(false);
    });

    it("deve recuperar carrinho existente do localStorage", async () => {
      // Setup: simular cartId no localStorage e resposta do getCart
      const mockCartId = "gid://shopify/Cart/test123";
      localStorageMock.setItem("shopify_cart_id", mockCartId);

      const mockCartData = {
        id: mockCartId,
        checkoutUrl: "https://checkout.test",
        lines: {
          edges: [
            {
              node: {
                id: "line1",
                quantity: 2,
                merchandise: {
                  price: { amount: "29.99" },
                  product: {
                    title: "Produto Teste",
                    images: { edges: [{ node: { url: "https://image.test" } }] },
                  },
                },
              },
            },
          ],
        },
      };

      vi.mocked(shopify.getCart).mockResolvedValue(mockCartData as never);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      // Aguardar atualização assíncrona
      await waitFor(() => {
        expect(result.current.cartId).toBe(mockCartId);
        expect(result.current.cart).toHaveLength(1);
        expect(result.current.cart[0].title).toBe("Produto Teste");
        expect(result.current.totalQuantity).toBe(2);
      });

      expect(shopify.getCart).toHaveBeenCalledWith(mockCartId);
    });

    it("deve lidar silenciosamente com erro ao recuperar carrinho antigo", async () => {
      const mockCartId = "gid://shopify/Cart/expired";
      localStorageMock.setItem("shopify_cart_id", mockCartId);

      vi.mocked(shopify.getCart).mockRejectedValue(new Error("Cart expired"));

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      // Carrinho deve permanecer vazio, sem throw de erro
      await waitFor(() => {
        expect(result.current.cart).toEqual([]);
      });
    });
  });

  describe("Adicionar item ao carrinho", () => {
    it("deve criar novo carrinho e adicionar item quando não existe cartId", async () => {
      const mockNewCart = { id: "gid://shopify/Cart/new123" };
      const mockCartData = {
        id: mockNewCart.id,
        checkoutUrl: "https://checkout.test",
        lines: {
          edges: [
            {
              node: {
                id: "line1",
                quantity: 1,
                merchandise: {
                  price: { amount: "49.99" },
                  product: {
                    title: "Novo Produto",
                    images: { edges: [{ node: { url: "https://image.test" } }] },
                  },
                },
              },
            },
          ],
        },
      };

      vi.mocked(shopify.createCart).mockResolvedValue(mockNewCart as never);
      vi.mocked(shopify.addToCart).mockResolvedValue({ cart: mockCartData } as never);
      vi.mocked(shopify.getCart).mockResolvedValue(mockCartData as never);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      await act(async () => {
        await result.current.addItemToCart("variant123", 1);
      });

      expect(shopify.createCart).toHaveBeenCalled();
      expect(shopify.addToCart).toHaveBeenCalledWith(mockNewCart.id, "variant123", 1);
      expect(localStorageMock.getItem("shopify_cart_id")).toBe(mockNewCart.id);

      await waitFor(() => {
        expect(result.current.cart).toHaveLength(1);
        expect(result.current.isCartOpen).toBe(true);
      });
    });

    it("deve adicionar item a carrinho existente", async () => {
      const mockCartId = "gid://shopify/Cart/existing";
      const mockCartData = {
        id: mockCartId,
        checkoutUrl: "https://checkout.test",
        lines: {
          edges: [
            {
              node: {
                id: "line1",
                quantity: 1,
                merchandise: {
                  price: { amount: "19.99" },
                  product: {
                    title: "Item Existente",
                    images: { edges: [{ node: { url: "https://image.test" } }] },
                  },
                },
              },
            },
            {
              node: {
                id: "line2",
                quantity: 2,
                merchandise: {
                  price: { amount: "29.99" },
                  product: {
                    title: "Novo Item",
                    images: { edges: [{ node: { url: "https://image2.test" } }] },
                  },
                },
              },
            },
          ],
        },
      };

      localStorageMock.setItem("shopify_cart_id", mockCartId);
      vi.mocked(shopify.getCart).mockResolvedValue(mockCartData as never);
      vi.mocked(shopify.addToCart).mockResolvedValue({ cart: mockCartData } as never);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      await waitFor(() => {
        expect(result.current.cartId).toBe(mockCartId);
      });

      await act(async () => {
        await result.current.addItemToCart("variant456", 2);
      });

      expect(shopify.addToCart).toHaveBeenCalledWith(mockCartId, "variant456", 2);

      await waitFor(() => {
        expect(result.current.cart).toHaveLength(2);
        expect(result.current.totalQuantity).toBe(3);
      });
    });

    it("deve criar novo carrinho se o antigo expirou (auto-reparação)", async () => {
      const expiredCartId = "gid://shopify/Cart/expired";
      const newCartId = "gid://shopify/Cart/new456";

      localStorageMock.setItem("shopify_cart_id", expiredCartId);

      const mockNewCart = { id: newCartId };
      const mockNewCartData = {
        id: newCartId,
        checkoutUrl: "https://checkout.test",
        lines: {
          edges: [
            {
              node: {
                id: "line1",
                quantity: 1,
                merchandise: {
                  price: { amount: "39.99" },
                  product: {
                    title: "Item Recuperado",
                    images: { edges: [{ node: { url: "https://image.test" } }] },
                  },
                },
              },
            },
          ],
        },
      };

      // Primeira chamada getCart retorna null (inicialização)
      // addToCart falha (carrinho expirado)
      // createCart cria novo
      // Segundo addToCart sucede
      vi.mocked(shopify.getCart)
        .mockResolvedValueOnce(null as never) // Inicialização
        .mockResolvedValueOnce(mockNewCartData as never); // Após criar novo

      vi.mocked(shopify.addToCart)
        .mockResolvedValueOnce(null as never) // Falha com expired
        .mockResolvedValueOnce({ cart: mockNewCartData } as never); // Sucesso com novo

      vi.mocked(shopify.createCart).mockResolvedValue(mockNewCart as never);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      // Aguardar inicialização
      await waitFor(() => {
        expect(result.current.cartId).toBe(expiredCartId);
      });

      // Tentar adicionar item (vai falhar e criar novo)
      await act(async () => {
        await result.current.addItemToCart("variant789", 1);
      });

      // Verificar que criou novo carrinho
      expect(shopify.createCart).toHaveBeenCalled();
      expect(localStorageMock.getItem("shopify_cart_id")).toBe(newCartId);

      await waitFor(() => {
        expect(result.current.cartId).toBe(newCartId);
        expect(result.current.cart).toHaveLength(1);
      });
    });
  });

  describe("Atualizar quantidade", () => {
    it("deve atualizar quantidade de item existente", async () => {
      const mockCartId = "gid://shopify/Cart/test";
      localStorageMock.setItem("shopify_cart_id", mockCartId);

      const initialCartData = {
        id: mockCartId,
        checkoutUrl: "https://checkout.test",
        lines: {
          edges: [
            {
              node: {
                id: "line1",
                quantity: 1,
                merchandise: {
                  price: { amount: "25.00" },
                  product: {
                    title: "Produto",
                    images: { edges: [{ node: { url: "https://image.test" } }] },
                  },
                },
              },
            },
          ],
        },
      };

      const updatedCartData = {
        ...initialCartData,
        lines: {
          edges: [
            {
              node: {
                ...initialCartData.lines.edges[0].node,
                quantity: 3,
              },
            },
          ],
        },
      };

      vi.mocked(shopify.getCart)
        .mockResolvedValueOnce(initialCartData as never)
        .mockResolvedValueOnce(updatedCartData as never);
      vi.mocked(shopify.updateCartLines).mockResolvedValue({} as never);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      await waitFor(() => {
        expect(result.current.cart).toHaveLength(1);
        expect(result.current.totalQuantity).toBe(1);
      });

      await act(async () => {
        await result.current.updateQuantity("line1", 3);
      });

      expect(shopify.updateCartLines).toHaveBeenCalledWith(mockCartId, "line1", 3);

      await waitFor(() => {
        expect(result.current.totalQuantity).toBe(3);
      });
    });
  });

  describe("Remover item", () => {
    it("deve remover item do carrinho", async () => {
      const mockCartId = "gid://shopify/Cart/test";
      localStorageMock.setItem("shopify_cart_id", mockCartId);

      const initialCartData = {
        id: mockCartId,
        checkoutUrl: "https://checkout.test",
        lines: {
          edges: [
            {
              node: {
                id: "line1",
                quantity: 2,
                merchandise: {
                  price: { amount: "30.00" },
                  product: {
                    title: "Produto A",
                    images: { edges: [{ node: { url: "https://image1.test" } }] },
                  },
                },
              },
            },
            {
              node: {
                id: "line2",
                quantity: 1,
                merchandise: {
                  price: { amount: "15.00" },
                  product: {
                    title: "Produto B",
                    images: { edges: [{ node: { url: "https://image2.test" } }] },
                  },
                },
              },
            },
          ],
        },
      };

      const afterRemoveCartData = {
        ...initialCartData,
        lines: {
          edges: [initialCartData.lines.edges[1]], // Apenas line2 resta
        },
      };

      vi.mocked(shopify.getCart)
        .mockResolvedValueOnce(initialCartData as never)
        .mockResolvedValueOnce(afterRemoveCartData as never);
      vi.mocked(shopify.removeFromCart).mockResolvedValue({} as never);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      await waitFor(() => {
        expect(result.current.cart).toHaveLength(2);
        expect(result.current.totalQuantity).toBe(3);
      });

      await act(async () => {
        await result.current.removeFromCart("line1");
      });

      expect(shopify.removeFromCart).toHaveBeenCalledWith(mockCartId, "line1");

      await waitFor(() => {
        expect(result.current.cart).toHaveLength(1);
        expect(result.current.cart[0].title).toBe("Produto B");
        expect(result.current.totalQuantity).toBe(1);
      });
    });
  });

  describe("Controle de visibilidade", () => {
    it("deve abrir e fechar carrinho", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.isCartOpen).toBe(false);

      act(() => {
        result.current.openCart();
      });

      expect(result.current.isCartOpen).toBe(true);

      act(() => {
        result.current.closeCart();
      });

      expect(result.current.isCartOpen).toBe(false);
    });

    it("deve abrir carrinho automaticamente ao adicionar item", async () => {
      const mockCartId = "gid://shopify/Cart/test";
      const mockCartData = {
        id: mockCartId,
        checkoutUrl: "https://checkout.test",
        lines: { edges: [] },
      };

      vi.mocked(shopify.createCart).mockResolvedValue({ id: mockCartId } as never);
      vi.mocked(shopify.addToCart).mockResolvedValue({ cart: mockCartData } as never);
      vi.mocked(shopify.getCart).mockResolvedValue(mockCartData as never);

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.isCartOpen).toBe(false);

      await act(async () => {
        await result.current.addItemToCart("variant123", 1);
      });

      await waitFor(() => {
        expect(result.current.isCartOpen).toBe(true);
      });
    });
  });

  describe("useCart hook", () => {
    it("deve lançar erro quando usado fora do CartProvider", () => {
      // Suprimir erro no console durante o teste
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCart());
      }).toThrow("useCart deve ser usado dentro de um CartProvider");

      consoleError.mockRestore();
    });
  });
});

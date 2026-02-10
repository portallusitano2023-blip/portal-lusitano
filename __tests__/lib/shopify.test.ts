import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// vi.hoisted runs BEFORE any imports, ensuring env vars and mocks are set
// before shopify.ts module-level code reads process.env and fetch
const mockFetch = vi.hoisted(() => {
  // Set env vars before shopify.ts module evaluates its top-level constants
  process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN = "test-store.myshopify.com";
  process.env.NEXT_PUBLIC_SHOPIFY_TOKEN = "test-storefront-token";
  return vi.fn();
});

vi.stubGlobal("fetch", mockFetch);

import {
  getProducts,
  getProduct,
  createCart,
  addToCart,
  removeFromCart,
  getCustomer,
} from "@/lib/shopify";

describe("shopify", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    mockFetch.mockReset();
  });

  // Helper to create a fetch response
  function mockFetchResponse(data: unknown) {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data),
    });
  }

  function mockFetchError() {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
  }

  // =============================================
  // getProducts
  // =============================================
  describe("getProducts", () => {
    it("deve retornar produtos formatados com imagens achatadas", async () => {
      mockFetchResponse({
        data: {
          products: {
            edges: [
              {
                node: {
                  id: "gid://shopify/Product/1",
                  handle: "camisola-lusitana",
                  title: "Camisola Lusitana",
                  images: {
                    edges: [{ node: { url: "https://cdn.shopify.com/img1.jpg" } }],
                  },
                  priceRange: {
                    minVariantPrice: { amount: "49.99" },
                  },
                },
              },
              {
                node: {
                  id: "gid://shopify/Product/2",
                  handle: "polo-equestre",
                  title: "Polo Equestre",
                  images: {
                    edges: [{ node: { url: "https://cdn.shopify.com/img2.jpg" } }],
                  },
                  priceRange: {
                    minVariantPrice: { amount: "79.99" },
                  },
                },
              },
            ],
          },
        },
      });

      const products = await getProducts();

      expect(products).toHaveLength(2);
      expect(products[0].title).toBe("Camisola Lusitana");
      expect(products[0].handle).toBe("camisola-lusitana");
      // Imagens devem estar achatadas (sem edges/node)
      expect(products[0].images).toEqual([{ url: "https://cdn.shopify.com/img1.jpg" }]);
      expect(products[1].title).toBe("Polo Equestre");
    });

    it("deve retornar array vazio quando fetch falha", async () => {
      mockFetchError();

      const products = await getProducts();

      expect(products).toEqual([]);
    });

    it("deve retornar array vazio quando data e null", async () => {
      mockFetchResponse({ data: null });

      const products = await getProducts();

      expect(products).toEqual([]);
    });

    it("deve enviar pedido ao endpoint correcto do Shopify", async () => {
      mockFetchResponse({ data: { products: { edges: [] } } });

      await getProducts();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://test-store.myshopify.com/api/2024-01/graphql.json",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": "test-storefront-token",
          }),
        })
      );
    });
  });

  // =============================================
  // getProduct
  // =============================================
  describe("getProduct", () => {
    it("deve retornar produto com imagens e variantes achatadas", async () => {
      mockFetchResponse({
        data: {
          productByHandle: {
            id: "gid://shopify/Product/1",
            title: "Camisola Lusitana Premium",
            handle: "camisola-lusitana-premium",
            descriptionHtml: "<p>Camisola de alta qualidade</p>",
            images: {
              edges: [
                { node: { url: "https://cdn.shopify.com/img1.jpg" } },
                { node: { url: "https://cdn.shopify.com/img2.jpg" } },
              ],
            },
            variants: {
              edges: [
                {
                  node: {
                    id: "gid://shopify/ProductVariant/1",
                    title: "S",
                    availableForSale: true,
                    price: { amount: "49.99" },
                    image: { url: "https://cdn.shopify.com/var1.jpg" },
                  },
                },
                {
                  node: {
                    id: "gid://shopify/ProductVariant/2",
                    title: "M",
                    availableForSale: false,
                    price: { amount: "49.99" },
                    image: null,
                  },
                },
              ],
            },
          },
        },
      });

      const product = await getProduct("camisola-lusitana-premium");

      expect(product).not.toBeNull();
      expect(product!.title).toBe("Camisola Lusitana Premium");
      expect(product!.descriptionHtml).toBe("<p>Camisola de alta qualidade</p>");

      // Imagens achatadas
      expect(product!.images).toEqual([
        { url: "https://cdn.shopify.com/img1.jpg" },
        { url: "https://cdn.shopify.com/img2.jpg" },
      ]);

      // Variantes achatadas
      expect(product!.variants).toHaveLength(2);
      expect(product!.variants[0].title).toBe("S");
      expect(product!.variants[0].availableForSale).toBe(true);
      expect(product!.variants[1].title).toBe("M");
      expect(product!.variants[1].availableForSale).toBe(false);
    });

    it("deve retornar null para produto inexistente", async () => {
      mockFetchResponse({
        data: {
          productByHandle: null,
        },
      });

      const product = await getProduct("nao-existe");

      expect(product).toBeNull();
    });

    it("deve retornar null quando fetch falha", async () => {
      mockFetchError();

      const product = await getProduct("qualquer-handle");

      expect(product).toBeNull();
    });

    it("deve enviar handle como variavel GraphQL", async () => {
      mockFetchResponse({ data: { productByHandle: null } });

      await getProduct("meu-produto");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.variables).toEqual({ handle: "meu-produto" });
    });

    it("deve retornar variantes vazio quando produto nao tem variantes", async () => {
      mockFetchResponse({
        data: {
          productByHandle: {
            id: "gid://shopify/Product/3",
            title: "Produto Simples",
            handle: "produto-simples",
            images: { edges: [] },
            variants: undefined,
          },
        },
      });

      const product = await getProduct("produto-simples");

      expect(product).not.toBeNull();
      expect(product!.variants).toEqual([]);
    });
  });

  // =============================================
  // createCart
  // =============================================
  describe("createCart", () => {
    it("deve retornar objecto cart com id e checkoutUrl", async () => {
      mockFetchResponse({
        data: {
          cartCreate: {
            cart: {
              id: "gid://shopify/Cart/abc123",
              checkoutUrl: "https://test-store.myshopify.com/cart/c/abc123",
              totalQuantity: 0,
            },
          },
        },
      });

      const cart = await createCart();

      expect(cart).toBeDefined();
      expect(cart!.id).toBe("gid://shopify/Cart/abc123");
      expect(cart!.checkoutUrl).toContain("cart/c/abc123");
      expect(cart!.totalQuantity).toBe(0);
    });

    it("deve retornar undefined quando fetch falha", async () => {
      mockFetchError();

      const cart = await createCart();

      expect(cart).toBeUndefined();
    });

    it("deve enviar mutation cartCreate", async () => {
      mockFetchResponse({ data: { cartCreate: { cart: { id: "c1" } } } });

      await createCart();

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.query).toContain("cartCreate");
    });
  });

  // =============================================
  // addToCart
  // =============================================
  describe("addToCart", () => {
    it("deve enviar variaveis correctas para adicionar ao carrinho", async () => {
      mockFetchResponse({
        data: {
          cartLinesAdd: {
            cart: {
              id: "gid://shopify/Cart/abc123",
              checkoutUrl: "https://test-store.myshopify.com/cart/c/abc123",
              totalQuantity: 2,
            },
          },
        },
      });

      const cart = await addToCart(
        "gid://shopify/Cart/abc123",
        "gid://shopify/ProductVariant/1",
        2
      );

      expect(cart).toBeDefined();
      expect(cart!.totalQuantity).toBe(2);

      // Verificar as variaveis enviadas
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.variables.cartId).toBe("gid://shopify/Cart/abc123");
      expect(callBody.variables.lines).toEqual([
        { merchandiseId: "gid://shopify/ProductVariant/1", quantity: 2 },
      ]);
    });

    it("deve usar quantidade 1 por defeito", async () => {
      mockFetchResponse({
        data: {
          cartLinesAdd: {
            cart: { id: "cart1", checkoutUrl: "url", totalQuantity: 1 },
          },
        },
      });

      await addToCart("cart1", "variant1");

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.variables.lines[0].quantity).toBe(1);
    });

    it("deve retornar undefined quando fetch falha", async () => {
      mockFetchError();

      const cart = await addToCart("cart1", "variant1", 1);

      expect(cart).toBeUndefined();
    });
  });

  // =============================================
  // removeFromCart
  // =============================================
  describe("removeFromCart", () => {
    it("deve enviar variaveis correctas para remover do carrinho", async () => {
      mockFetchResponse({
        data: {
          cartLinesRemove: {
            cart: {
              id: "gid://shopify/Cart/abc123",
              checkoutUrl: "https://test-store.myshopify.com/cart/c/abc123",
              totalQuantity: 0,
            },
          },
        },
      });

      const cart = await removeFromCart("gid://shopify/Cart/abc123", "line-id-1");

      expect(cart).toBeDefined();
      expect(cart!.totalQuantity).toBe(0);

      // Verificar as variaveis enviadas
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.variables.cartId).toBe("gid://shopify/Cart/abc123");
      expect(callBody.variables.lineIds).toEqual(["line-id-1"]);
    });

    it("deve retornar undefined quando fetch falha", async () => {
      mockFetchError();

      const cart = await removeFromCart("cart1", "line1");

      expect(cart).toBeUndefined();
    });

    it("deve enviar mutation cartLinesRemove", async () => {
      mockFetchResponse({
        data: { cartLinesRemove: { cart: { id: "c1" } } },
      });

      await removeFromCart("c1", "l1");

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.query).toContain("cartLinesRemove");
    });
  });

  // =============================================
  // getCustomer
  // =============================================
  describe("getCustomer", () => {
    it("deve retornar dados do cliente correctamente", async () => {
      mockFetchResponse({
        data: {
          customer: {
            id: "gid://shopify/Customer/1",
            firstName: "Joao",
            lastName: "Silva",
            email: "joao@test.com",
            phone: "+351912345678",
            defaultAddress: {
              address1: "Rua das Flores 10",
              city: "Lisboa",
              country: "Portugal",
              zip: "1100-001",
            },
            orders: {
              edges: [
                {
                  node: {
                    id: "gid://shopify/Order/1",
                    orderNumber: 1001,
                    processedAt: "2026-01-15T10:00:00Z",
                    financialStatus: "PAID",
                    fulfillmentStatus: "FULFILLED",
                    totalPrice: { amount: "149.99", currencyCode: "EUR" },
                    lineItems: {
                      edges: [
                        {
                          node: {
                            title: "Camisola Lusitana",
                            quantity: 2,
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      });

      const customer = await getCustomer("customer-access-token-123");

      expect(customer).toBeDefined();
      expect(customer!.firstName).toBe("Joao");
      expect(customer!.lastName).toBe("Silva");
      expect(customer!.email).toBe("joao@test.com");
      expect(customer!.defaultAddress!.city).toBe("Lisboa");
      expect(customer!.orders.edges).toHaveLength(1);
      expect(customer!.orders.edges[0].node.orderNumber).toBe(1001);
    });

    it("deve enviar accessToken como variavel GraphQL", async () => {
      mockFetchResponse({ data: { customer: null } });

      await getCustomer("my-token-123");

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.variables.accessToken).toBe("my-token-123");
    });

    it("deve retornar null quando cliente nao existe", async () => {
      mockFetchResponse({ data: { customer: null } });

      const customer = await getCustomer("invalid-token");

      expect(customer).toBeNull();
    });

    it("deve retornar undefined quando fetch falha", async () => {
      mockFetchError();

      const customer = await getCustomer("any-token");

      expect(customer).toBeUndefined();
    });

    it("deve retornar cliente sem morada quando defaultAddress e null", async () => {
      mockFetchResponse({
        data: {
          customer: {
            id: "gid://shopify/Customer/2",
            firstName: "Maria",
            lastName: "Santos",
            email: "maria@test.com",
            phone: null,
            defaultAddress: null,
            orders: { edges: [] },
          },
        },
      });

      const customer = await getCustomer("token-maria");

      expect(customer).toBeDefined();
      expect(customer!.firstName).toBe("Maria");
      expect(customer!.defaultAddress).toBeNull();
      expect(customer!.orders.edges).toHaveLength(0);
    });
  });
});

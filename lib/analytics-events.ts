/**
 * Analytics Event Tracking - Portal Lusitano
 *
 * Biblioteca centralizada para tracking de eventos no Google Analytics 4 e Meta Pixel.
 *
 * @example
 * ```typescript
 * import { analytics } from '@/lib/analytics-events';
 *
 * // View de cavalo
 * analytics.viewCavalo({
 *   id: '123',
 *   nome: 'Novilheiro',
 *   preco: 50000,
 *   coudelaria: 'Manuel Veiga',
 * });
 *
 * // Add to cart
 * analytics.addToCart({
 *   id: 'prod-456',
 *   nome: 'Selim de Couro',
 *   preco: 299.99,
 *   categoria: 'Selaria',
 * });
 * ```
 */

// ============================================================================
// Event Names (para GA4 e Meta Pixel)
// ============================================================================

export enum AnalyticsEvent {
  // Cavalos
  VIEW_CAVALO = "view_cavalo",
  CONTACT_CAVALO = "contact_cavalo",
  FAVORITE_CAVALO = "favorite_cavalo",

  // Produtos (Loja)
  VIEW_PRODUCT = "view_item",
  ADD_TO_CART = "add_to_cart",
  REMOVE_FROM_CART = "remove_from_cart",
  BEGIN_CHECKOUT = "begin_checkout",
  PURCHASE = "purchase",
  VIEW_CART = "view_cart",

  // Coudelarias
  VIEW_COUDELARIA = "view_coudelaria",
  CONTACT_COUDELARIA = "contact_coudelaria",
  SUBMIT_REVIEW = "submit_review",

  // Conteúdo
  VIEW_ARTICLE = "view_article",
  SHARE_ARTICLE = "share",

  // Engajamento
  NEWSLETTER_SIGNUP = "newsletter_signup",
  SEARCH = "search",
  FILTER_APPLY = "filter_apply",

  // WhatsApp
  WHATSAPP_CLICK = "whatsapp_click",
}

// ============================================================================
// Type Definitions
// ============================================================================

interface CavaloEventData {
  id: string;
  nome: string;
  preco?: number;
  coudelaria?: string;
  idade?: number;
  pelagem?: string;
}

interface ProductEventData {
  id: string;
  nome: string;
  preco: number;
  categoria?: string;
  marca?: string;
  quantidade?: number;
}

interface CoudelariaEventData {
  id: string;
  nome: string;
  localizacao?: string;
  regiao?: string;
}

interface ArticleEventData {
  id: string;
  titulo: string;
  categoria?: string;
  autor?: string;
}

interface SearchEventData {
  query: string;
  results?: number;
}

// ============================================================================
// Helper: Check if Analytics is Available
// ============================================================================

function isGA4Available(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

function isMetaPixelAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

// ============================================================================
// Low-level Tracking Functions
// ============================================================================

/**
 * Track event no Google Analytics 4
 */
function trackGA4(eventName: string, eventParams?: Record<string, unknown>) {
  if (!isGA4Available()) {
    console.warn("[Analytics] GA4 not available");
    return;
  }

  try {
    window.gtag?.("event", eventName, eventParams);
  } catch (error) {
    console.error("[GA4] Error tracking event:", error);
  }
}

/**
 * Track event no Meta Pixel
 */
function trackMetaPixel(eventName: string, eventParams?: Record<string, unknown>) {
  if (!isMetaPixelAvailable()) {
    console.warn("[Analytics] Meta Pixel not available");
    return;
  }

  try {
    window.fbq?.("track", eventName, eventParams);
  } catch (error) {
    console.error("[Meta Pixel] Error tracking event:", error);
  }
}

/**
 * Track event em ambas as plataformas
 */
function trackEvent(
  ga4EventName: string,
  metaEventName: string,
  ga4Params?: Record<string, unknown>,
  metaParams?: Record<string, unknown>
) {
  trackGA4(ga4EventName, ga4Params);
  trackMetaPixel(metaEventName, metaParams || ga4Params);
}

// ============================================================================
// High-level Analytics API
// ============================================================================

export const analytics = {
  // ========================================
  // CAVALOS
  // ========================================

  /**
   * Track visualização de cavalo
   */
  viewCavalo(data: CavaloEventData) {
    trackEvent(
      AnalyticsEvent.VIEW_CAVALO,
      "ViewContent",
      {
        content_type: "cavalo",
        content_id: data.id,
        content_name: data.nome,
        value: data.preco || 0,
        currency: "EUR",
        custom_coudelaria: data.coudelaria,
        custom_idade: data.idade,
        custom_pelagem: data.pelagem,
      },
      {
        content_type: "cavalo",
        content_ids: [data.id],
        content_name: data.nome,
        value: data.preco || 0,
        currency: "EUR",
      }
    );
  },

  /**
   * Track contacto de cavalo (WhatsApp/Email)
   */
  contactCavalo(data: CavaloEventData & { method: "whatsapp" | "email" }) {
    trackEvent(AnalyticsEvent.CONTACT_CAVALO, "Contact", {
      content_type: "cavalo",
      content_id: data.id,
      content_name: data.nome,
      method: data.method,
      value: data.preco || 0,
      currency: "EUR",
    });
  },

  /**
   * Track favoritar cavalo
   */
  favoriteCavalo(data: CavaloEventData) {
    trackEvent(AnalyticsEvent.FAVORITE_CAVALO, "AddToWishlist", {
      content_type: "cavalo",
      content_id: data.id,
      content_name: data.nome,
      value: data.preco || 0,
      currency: "EUR",
    });
  },

  // ========================================
  // PRODUTOS (LOJA)
  // ========================================

  /**
   * Track visualização de produto
   */
  viewProduct(data: ProductEventData) {
    trackEvent(
      AnalyticsEvent.VIEW_PRODUCT,
      "ViewContent",
      {
        content_type: "product",
        items: [
          {
            item_id: data.id,
            item_name: data.nome,
            price: data.preco,
            item_category: data.categoria,
            item_brand: data.marca,
          },
        ],
        value: data.preco,
        currency: "EUR",
      },
      {
        content_type: "product",
        content_ids: [data.id],
        content_name: data.nome,
        value: data.preco,
        currency: "EUR",
      }
    );
  },

  /**
   * Track adicionar ao carrinho
   */
  addToCart(data: ProductEventData) {
    trackEvent(
      AnalyticsEvent.ADD_TO_CART,
      "AddToCart",
      {
        items: [
          {
            item_id: data.id,
            item_name: data.nome,
            price: data.preco,
            item_category: data.categoria,
            quantity: data.quantidade || 1,
          },
        ],
        value: data.preco * (data.quantidade || 1),
        currency: "EUR",
      },
      {
        content_ids: [data.id],
        content_name: data.nome,
        content_type: "product",
        value: data.preco * (data.quantidade || 1),
        currency: "EUR",
      }
    );
  },

  /**
   * Track remover do carrinho
   */
  removeFromCart(data: ProductEventData) {
    trackGA4(AnalyticsEvent.REMOVE_FROM_CART, {
      items: [
        {
          item_id: data.id,
          item_name: data.nome,
          price: data.preco,
          quantity: data.quantidade || 1,
        },
      ],
      value: data.preco * (data.quantidade || 1),
      currency: "EUR",
    });
  },

  /**
   * Track visualizar carrinho
   */
  viewCart(data: { items: ProductEventData[]; totalValue: number }) {
    trackGA4(AnalyticsEvent.VIEW_CART, {
      items: data.items.map((item) => ({
        item_id: item.id,
        item_name: item.nome,
        price: item.preco,
        quantity: item.quantidade || 1,
      })),
      value: data.totalValue,
      currency: "EUR",
    });
  },

  /**
   * Track iniciar checkout
   */
  beginCheckout(data: { items: ProductEventData[]; totalValue: number }) {
    trackEvent(
      AnalyticsEvent.BEGIN_CHECKOUT,
      "InitiateCheckout",
      {
        items: data.items.map((item) => ({
          item_id: item.id,
          item_name: item.nome,
          price: item.preco,
          quantity: item.quantidade || 1,
        })),
        value: data.totalValue,
        currency: "EUR",
      },
      {
        content_ids: data.items.map((item) => item.id),
        contents: data.items.map((item) => ({
          id: item.id,
          quantity: item.quantidade || 1,
        })),
        value: data.totalValue,
        currency: "EUR",
      }
    );
  },

  /**
   * Track compra completada
   */
  purchase(data: {
    transactionId: string;
    items: ProductEventData[];
    totalValue: number;
    shipping?: number;
    tax?: number;
  }) {
    trackEvent(
      AnalyticsEvent.PURCHASE,
      "Purchase",
      {
        transaction_id: data.transactionId,
        value: data.totalValue,
        currency: "EUR",
        shipping: data.shipping || 0,
        tax: data.tax || 0,
        items: data.items.map((item) => ({
          item_id: item.id,
          item_name: item.nome,
          price: item.preco,
          quantity: item.quantidade || 1,
        })),
      },
      {
        content_ids: data.items.map((item) => item.id),
        content_type: "product",
        value: data.totalValue,
        currency: "EUR",
      }
    );
  },

  // ========================================
  // COUDELARIAS
  // ========================================

  /**
   * Track visualização de coudelaria
   */
  viewCoudelaria(data: CoudelariaEventData) {
    trackGA4(AnalyticsEvent.VIEW_COUDELARIA, {
      content_type: "coudelaria",
      content_id: data.id,
      content_name: data.nome,
      custom_localizacao: data.localizacao,
      custom_regiao: data.regiao,
    });
  },

  /**
   * Track contacto de coudelaria
   */
  contactCoudelaria(data: CoudelariaEventData & { method: string }) {
    trackGA4(AnalyticsEvent.CONTACT_COUDELARIA, {
      content_type: "coudelaria",
      content_id: data.id,
      content_name: data.nome,
      method: data.method,
    });
  },

  /**
   * Track submissão de review
   */
  submitReview(data: CoudelariaEventData & { rating: number }) {
    trackGA4(AnalyticsEvent.SUBMIT_REVIEW, {
      content_type: "coudelaria",
      content_id: data.id,
      content_name: data.nome,
      rating: data.rating,
    });
  },

  // ========================================
  // CONTEÚDO
  // ========================================

  /**
   * Track visualização de artigo
   */
  viewArticle(data: ArticleEventData) {
    trackGA4(AnalyticsEvent.VIEW_ARTICLE, {
      content_type: "article",
      content_id: data.id,
      content_name: data.titulo,
      article_category: data.categoria,
      article_author: data.autor,
    });
  },

  /**
   * Track partilha de conteúdo
   */
  shareContent(data: { contentType: string; contentId: string; method: string }) {
    trackGA4(AnalyticsEvent.SHARE_ARTICLE, {
      content_type: data.contentType,
      content_id: data.contentId,
      method: data.method,
    });
  },

  // ========================================
  // ENGAJAMENTO
  // ========================================

  /**
   * Track inscrição newsletter
   */
  newsletterSignup(data: { email: string; source?: string }) {
    trackEvent(
      AnalyticsEvent.NEWSLETTER_SIGNUP,
      "Lead",
      {
        method: "newsletter",
        source: data.source || "footer",
      },
      {
        content_name: "newsletter_signup",
        status: true,
      }
    );
  },

  /**
   * Track pesquisa
   */
  search(data: SearchEventData) {
    trackGA4(AnalyticsEvent.SEARCH, {
      search_term: data.query,
      results_count: data.results,
    });
  },

  /**
   * Track aplicação de filtros
   */
  applyFilter(data: { filterType: string; filterValue: string; context: string }) {
    trackGA4(AnalyticsEvent.FILTER_APPLY, {
      filter_type: data.filterType,
      filter_value: data.filterValue,
      context: data.context,
    });
  },

  /**
   * Track clique no WhatsApp
   */
  whatsappClick(data: { source: string; contentId?: string }) {
    trackGA4(AnalyticsEvent.WHATSAPP_CLICK, {
      source: data.source,
      content_id: data.contentId,
    });
  },
};

// ============================================================================
// Declare gtag global para TypeScript
// Nota: Declaração compatível com lib/analytics.ts
// ============================================================================

declare global {
  interface Window {
    gtag?: (...args: [string, ...unknown[]]) => void;
    fbq?: (...args: [string, ...unknown[]]) => void;
  }
}

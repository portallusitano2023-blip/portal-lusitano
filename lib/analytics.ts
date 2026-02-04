/**
 * ANALYTICS & CONVERSION TRACKING
 *
 * Sistema unificado para tracking de conversões:
 * - Google Analytics 4 (GA4)
 * - Meta Pixel (Facebook/Instagram)
 * - Eventos customizados
 */

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const isBrowser = typeof window !== "undefined";
const DEBUG_MODE = process.env.NODE_ENV === "development";

function debugLog(action: string, data: unknown) {
  if (DEBUG_MODE) {
    console.log(`[Analytics] ${action}:`, data);
  }
}

// ============================================================================
// GOOGLE ANALYTICS 4
// ============================================================================

export const pageview = (url: string) => {
  if (isBrowser && (window as any).gtag) {
    (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
    debugLog("GA4 Pageview", { url });
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (isBrowser && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    debugLog("GA4 Event", { action, category, label, value });
  }
};

// Enviar evento GA4 com parâmetros flexíveis
export function sendGA4Event(eventName: string, params?: Record<string, unknown>) {
  if (isBrowser && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
    debugLog("GA4 Event", { eventName, params });
  }
}

// ============================================================================
// META PIXEL (FACEBOOK/INSTAGRAM)
// ============================================================================

export function sendMetaEvent(eventName: string, params?: Record<string, unknown>) {
  if (isBrowser && (window as any).fbq) {
    (window as any).fbq("track", eventName, params);
    debugLog("Meta Pixel Event", { eventName, params });
  }
}

export function sendMetaCustomEvent(eventName: string, params?: Record<string, unknown>) {
  if (isBrowser && (window as any).fbq) {
    (window as any).fbq("trackCustom", eventName, params);
    debugLog("Meta Pixel Custom", { eventName, params });
  }
}

// Track specific events
export const trackEvent = {
  // E-commerce
  viewProduct: (productId: string, productName: string, price: number) => {
    event({
      action: "view_item",
      category: "ecommerce",
      label: productName,
      value: price,
    });
  },

  addToCart: (productId: string, productName: string, price: number) => {
    event({
      action: "add_to_cart",
      category: "ecommerce",
      label: productName,
      value: price,
    });
  },

  beginCheckout: (value: number) => {
    event({
      action: "begin_checkout",
      category: "ecommerce",
      value,
    });
  },

  purchase: (transactionId: string, value: number) => {
    event({
      action: "purchase",
      category: "ecommerce",
      label: transactionId,
      value,
    });
  },

  // Subscriptions
  subscribe: (plan: string, value: number) => {
    event({
      action: "subscribe",
      category: "subscription",
      label: plan,
      value,
    });
  },

  // Content
  readArticle: (articleTitle: string) => {
    event({
      action: "read_article",
      category: "content",
      label: articleTitle,
    });
  },

  downloadEbook: (ebookTitle: string) => {
    event({
      action: "download_ebook",
      category: "content",
      label: ebookTitle,
    });
  },

  // Engagement
  shareContent: (contentType: string, contentId: string) => {
    event({
      action: "share",
      category: "engagement",
      label: `${contentType}:${contentId}`,
    });
  },

  submitForm: (formName: string) => {
    event({
      action: "form_submit",
      category: "engagement",
      label: formName,
    });
  },

  // Navigation
  clickCTA: (ctaName: string, location: string) => {
    event({
      action: "click_cta",
      category: "navigation",
      label: `${ctaName} - ${location}`,
    });
  },

  // User behavior
  timeOnPage: (pageName: string, seconds: number) => {
    event({
      action: "time_on_page",
      category: "engagement",
      label: pageName,
      value: seconds,
    });
  },

  scrollDepth: (percentage: number) => {
    event({
      action: "scroll_depth",
      category: "engagement",
      value: percentage,
    });
  },
};

// ============================================================================
// EVENTOS ESPECÍFICOS DO PORTAL LUSITANO
// ============================================================================

/**
 * Track download do ebook gratuito
 */
export function trackEbookDownload(ebookId: string, ebookType: "free" = "free") {
  // GA4
  sendGA4Event("generate_lead", {
    currency: "EUR",
    value: 0,
    lead_source: "ebook_download",
    ebook_id: ebookId,
  });

  // Meta
  sendMetaEvent("Lead", {
    content_name: ebookId,
    content_category: "Free Ebook",
    value: 0,
    currency: "EUR",
  });
}

/**
 * Track subscrição email (lead capture)
 */
export function trackEmailSubscription(source: string) {
  sendGA4Event("sign_up", { method: "email", source });
  sendMetaEvent("CompleteRegistration", { content_name: source, status: "subscribed" });
}


/**
 * Track etapas do funil ebook
 */
export function trackEbookFunnel(step: "view_landing" | "start_form" | "submit_form" | "download_pdf") {
  const stepData = {
    view_landing: { name: "Ebook Landing View", num: 1 },
    start_form: { name: "Ebook Form Started", num: 2 },
    submit_form: { name: "Ebook Form Submitted", num: 3 },
    download_pdf: { name: "Ebook Downloaded", num: 4 },
  };

  sendGA4Event("funnel_step", {
    funnel_name: "free_ebook",
    step_name: stepData[step].name,
    step_number: stepData[step].num,
  });

  sendMetaCustomEvent("EbookFunnel", { step, step_number: stepData[step].num });
}


/**
 * Track partilha social
 */
export function trackSocialShare(platform: string, contentType: string, contentId: string) {
  sendGA4Event("share", { method: platform, content_type: contentType, item_id: contentId });
  sendMetaCustomEvent("Share", { platform, content_type: contentType, content_id: contentId });
}

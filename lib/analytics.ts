// Google Analytics / Plausible / Custom Analytics
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
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
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

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

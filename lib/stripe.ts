import Stripe from "stripe";

// Stripe server-side client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

// Planos PRO para Coudelarias
export const PLANS = {
  pro: {
    name: "PRO Diretório",
    description: "Apareça em destaque no diretório de coudelarias",
    prices: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
    },
    priceValue: {
      monthly: 29.99,
      yearly: 299.90,
    },
    features: [
      "Aparecer no TOPO do diretório",
      "Badge de Verificado",
      "Contactos visíveis (tel, email, site)",
      "Até 10 fotos da coudelaria",
      "Link para Instagram",
      "Descrição completa",
    ],
  },
  pro_instagram: {
    name: "PRO + Instagram",
    description: "Diretório + promoção no Instagram (19k seguidores)",
    prices: {
      monthly: process.env.STRIPE_PRICE_PRO_INSTAGRAM_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_PRO_INSTAGRAM_YEARLY!,
    },
    priceValue: {
      monthly: 49.99,
      yearly: 499.90,
    },
    features: [
      "TUDO do plano PRO",
      "1 post mensal no Instagram",
      "Exposição a 19.000 seguidores",
      "Stories de destaque",
      "Maior visibilidade online",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type BillingPeriod = "monthly" | "yearly";

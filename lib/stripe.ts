import Stripe from "stripe";

// Stripe server-side client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Planos de subscrição
export const PLANS = {
  aficionado: {
    name: "Aficionado",
    description: "Para quem ama o Lusitano e quer aprender mais",
    prices: {
      monthly: process.env.STRIPE_PRICE_AFICIONADO_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_AFICIONADO_YEARLY!,
    },
    features: [
      "Acesso a 5 Ebooks exclusivos",
      "Newsletter semanal premium",
      "Comunidade privada",
      "Desconto 10% na loja",
    ],
  },
  criador: {
    name: "Criador",
    description: "Para criadores e profissionais do sector",
    prices: {
      monthly: process.env.STRIPE_PRICE_CRIADOR_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_CRIADOR_YEARLY!,
    },
    features: [
      "Tudo do plano Aficionado",
      "Biblioteca completa de Ebooks",
      "Cursos em vídeo ilimitados",
      "Templates e ferramentas",
      "Webinars mensais ao vivo",
      "Certificações oficiais",
    ],
  },
  elite: {
    name: "Elite",
    description: "Acesso total + suporte personalizado",
    prices: {
      monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_ELITE_YEARLY!,
    },
    features: [
      "Tudo do plano Criador",
      "Consultoria ilimitada",
      "Acesso antecipado a cavalos",
      "Networking com criadores",
      "Visitas a coudelarias VIP",
      "Suporte prioritário 24/7",
      "Badge Elite verificado",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type BillingPeriod = "monthly" | "yearly";

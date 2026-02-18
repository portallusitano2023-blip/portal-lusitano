import type { Metadata } from "next";
import { BreadcrumbSchema, FAQSchema } from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Preços e Planos",
  description:
    "Ferramentas profissionais para o mercado do Cavalo Lusitano. Plano gratuito com 1 uso por ferramenta. Plano Pro por 4,99€/mês com usos ilimitados, relatórios PDF e histórico.",
  keywords: [
    "preços portal lusitano",
    "plano pro ferramentas lusitano",
    "calculadora valor cavalo preço",
    "subscrição ferramentas equestres",
    "ferramentas lusitano grátis",
  ],
  alternates: {
    canonical: `${siteUrl}/precos`,
  },
  openGraph: {
    title: "Preços e Planos | Portal Lusitano",
    description: "Ferramentas profissionais para o mercado Lusitano. Grátis ou Pro por 4,99€/mês.",
    url: `${siteUrl}/precos`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Preços e Planos — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Preços e Planos | Portal Lusitano",
    description: "Ferramentas profissionais para o mercado Lusitano. Grátis ou Pro por 4,99€/mês.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Preços e Planos", url: `${siteUrl}/precos` },
        ]}
      />
      <FAQSchema
        items={[
          {
            question: "Quanto custa o plano Pro do Portal Lusitano?",
            answer:
              "O plano Pro custa 4,99€ por mês. Inclui usos ilimitados em todas as ferramentas, exportação de relatórios em PDF, histórico completo de análises e suporte prioritário.",
          },
          {
            question: "Existe um plano gratuito?",
            answer:
              "Sim. O plano gratuito inclui 1 uso por ferramenta (Calculadora de Valor, Comparador de Cavalos, Verificador de Compatibilidade e Análise de Perfil), sem necessidade de registo.",
          },
          {
            question: "Posso cancelar a subscrição Pro a qualquer momento?",
            answer:
              "Sim, pode cancelar a qualquer momento sem compromissos ou taxas. Manterá acesso ao Pro até ao final do período de facturação em curso.",
          },
          {
            question: "Quanto custa anunciar um cavalo à venda?",
            answer:
              "A taxa de listagem no marketplace é de 75€ por anúncio. Inclui verificação APSL, publicação no directório e visibilidade durante 90 dias.",
          },
        ]}
      />
      {children}
    </>
  );
}

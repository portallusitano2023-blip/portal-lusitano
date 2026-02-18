import type { Metadata } from "next";
import { BreadcrumbSchema, FAQSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "O Portal Lusitano é a plataforma mais completa dedicada ao Cavalo Lusitano. Conheça a nossa missão, valores e a equipa por trás do projecto.",
  keywords: [
    "portal lusitano",
    "sobre nós",
    "cavalo lusitano plataforma",
    "missão portal lusitano",
    "equipa portal lusitano",
  ],
  alternates: {
    canonical: `${siteUrl}/sobre`,
  },
  openGraph: {
    title: "Sobre Nós | Portal Lusitano",
    description: "O Portal Lusitano é a plataforma mais completa dedicada ao Cavalo Lusitano.",
    url: `${siteUrl}/sobre`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sobre — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Nós | Portal Lusitano",
    description: "O Portal Lusitano é a plataforma mais completa dedicada ao Cavalo Lusitano.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Sobre Nós", url: `${siteUrl}/sobre` },
        ]}
      />
      <FAQSchema
        items={[
          {
            question: "O que é o Portal Lusitano?",
            answer:
              "O Portal Lusitano é a plataforma digital mais completa dedicada ao cavalo Lusitano. Oferece marketplace de cavalos, directório de coudelarias, ferramentas de avaliação, jornal editorial e loja equestre.",
          },
          {
            question: "O Portal Lusitano é gratuito?",
            answer:
              "Sim, a maior parte do conteúdo é gratuito: artigos, glossário, directório de coudelarias, eventos e o ebook introdutório. As ferramentas avançadas de análise têm versão gratuita e versão Pro.",
          },
          {
            question: "Como posso vender o meu cavalo no Portal Lusitano?",
            answer:
              "Pode registar o seu cavalo para venda na secção Vender Cavalo. Inclua fotos, vídeos, linhagem e informações veterinárias para maximizar o interesse dos compradores.",
          },
          {
            question: "O Portal Lusitano verifica a informação publicada?",
            answer:
              "Sim. Toda a informação editorial é verificada com fontes credíveis como a APSL, FEI, Eurodressage e outras publicações de referência. Dados não verificáveis são omitidos.",
          },
        ]}
      />
      {children}
    </>
  );
}

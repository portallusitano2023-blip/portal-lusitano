import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema, FAQSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Comprar Cavalo Lusitano",
  description:
    "Cavalos Lusitanos à venda em Portugal. Exemplares seleccionados com linhagem certificada APSL, veterinário verificado e entrega segura.",
  keywords: [
    "comprar cavalo lusitano",
    "cavalos à venda portugal",
    "PSL venda",
    "lusitanos certificados",
    "cavalos dressage venda",
    "compra cavalos",
  ],
  alternates: {
    canonical: `${siteUrl}/comprar`,
  },
  openGraph: {
    title: "Comprar Cavalo Lusitano | Portal Lusitano",
    description:
      "Cavalos Lusitanos à venda em Portugal. Exemplares seleccionados com linhagem certificada APSL, veterinário verificado e entrega segura.",
    url: `${siteUrl}/comprar`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Comprar Cavalo Lusitano — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comprar Cavalo Lusitano | Portal Lusitano",
    description:
      "Cavalos Lusitanos à venda em Portugal. Exemplares seleccionados com linhagem certificada APSL, veterinário verificado e entrega segura.",
    images: ["/og-image.jpg"],
  },
};

export default function ComprarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Comprar Cavalo Lusitano", url: `${siteUrl}/comprar` },
        ]}
      />
      <CollectionPageSchema
        name="Comprar Cavalo Lusitano"
        description="Cavalos Lusitanos à venda em Portugal. Exemplares seleccionados com linhagem certificada APSL, veterinário verificado e entrega segura."
        url={`${siteUrl}/comprar`}
      />
      <FAQSchema
        items={[
          {
            question: "Como comprar um cavalo Lusitano no Portal Lusitano?",
            answer:
              "Navegue pelos anúncios, utilize os filtros de idade, preço e disciplina para encontrar o exemplar ideal. Cada anúncio inclui fotos, linhagem e contacto directo com o vendedor.",
          },
          {
            question: "Os cavalos são verificados?",
            answer:
              "Os anúncios incluem informação de linhagem APSL quando disponível. Recomendamos sempre uma inspecção veterinária presencial antes da compra.",
          },
          {
            question: "Quanto custa um cavalo Lusitano?",
            answer:
              "O preço varia conforme a idade, treino, linhagem e aptidão. Cavalos jovens sem treino começam nos 5.000€, enquanto exemplares de competição podem ultrapassar os 50.000€.",
          },
        ]}
      />
      {children}
    </>
  );
}

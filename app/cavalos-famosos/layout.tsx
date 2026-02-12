import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/JsonLd";
import { cavalosFamosos } from "./data";

// ISR: Revalidate daily (historical data changes rarely)
export const revalidate = 86400;

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Lusitanos Notáveis",
  description:
    "Galeria dos cavalos Lusitanos mais famosos da história. Conheça os exemplares que levaram o PSL ao mais alto nível em Dressage, Atrelagem e Working Equitation.",
  keywords: [
    "cavalos lusitanos famosos",
    "PSL notáveis",
    "lusitanos olímpicos",
    "cavalos portugueses famosos",
    "história cavalo lusitano",
    "dressage lusitano",
  ],
  alternates: {
    canonical: `${siteUrl}/cavalos-famosos`,
  },
  openGraph: {
    title: "Lusitanos Notáveis | Portal Lusitano",
    description:
      "Galeria dos cavalos Lusitanos mais famosos da história. Conheça os exemplares que levaram o PSL ao mais alto nível em Dressage, Atrelagem e Working Equitation.",
    url: `${siteUrl}/cavalos-famosos`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "article",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lusitanos Notáveis | Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lusitanos Notáveis | Portal Lusitano",
    description:
      "Galeria dos cavalos Lusitanos mais famosos da história. Conheça os exemplares que levaram o PSL ao mais alto nível em Dressage, Atrelagem e Working Equitation.",
    images: ["/og-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Lusitanos Notáveis", url: `${siteUrl}/cavalos-famosos` },
        ]}
      />
      <CollectionPageSchema
        name="Lusitanos Notáveis"
        description="Galeria dos cavalos Lusitanos mais famosos da história. Conheça os exemplares que levaram o PSL ao mais alto nível em Dressage, Atrelagem e Working Equitation."
        url={`${siteUrl}/cavalos-famosos`}
      />
      <ItemListSchema
        name="Cavalos Lusitanos Famosos"
        description="Os 15 cavalos Lusitanos mais notáveis da história, verificados com fontes credíveis."
        items={cavalosFamosos.map((c) => ({
          name: c.nome,
          description: c.descricao,
          url: `${siteUrl}/cavalos-famosos#${c.id}`,
        }))}
      />
      {children}
    </>
  );
}

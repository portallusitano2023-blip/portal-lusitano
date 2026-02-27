import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/JsonLd";
import { cavalosFamosos } from "./data";
import { SITE_URL } from "@/lib/constants";

// ISR: Revalidate daily (historical data changes rarely)
export const revalidate = 86400;

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
    canonical: `${SITE_URL}/cavalos-famosos`,
  },
  openGraph: {
    title: "Lusitanos Notáveis | Portal Lusitano",
    description:
      "Galeria dos cavalos Lusitanos mais famosos da história. Conheça os exemplares que levaram o PSL ao mais alto nível em Dressage, Atrelagem e Working Equitation.",
    url: `${SITE_URL}/cavalos-famosos`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "article",
    images: [
      {
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Lusitanos Notáveis", url: `${SITE_URL}/cavalos-famosos` },
        ]}
      />
      <CollectionPageSchema
        name="Lusitanos Notáveis"
        description="Galeria dos cavalos Lusitanos mais famosos da história. Conheça os exemplares que levaram o PSL ao mais alto nível em Dressage, Atrelagem e Working Equitation."
        url={`${SITE_URL}/cavalos-famosos`}
      />
      <ItemListSchema
        name="Cavalos Lusitanos Famosos"
        description="Os 15 cavalos Lusitanos mais notáveis da história, verificados com fontes credíveis."
        items={cavalosFamosos.map((c) => ({
          name: c.nome,
          description: c.descricao,
          url: `${SITE_URL}/cavalos-famosos#${c.id}`,
        }))}
      />
      {children}
    </>
  );
}

import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Mapa Equestre de Portugal",
  description:
    "Mapa interactivo com coudelarias, centros hípicos, veterinários equinos, ferradores e eventos equestres em todo o território português.",
  keywords: [
    "mapa equestre portugal",
    "coudelarias mapa",
    "centros hípicos portugal",
    "onde montar portugal",
    "equitação portugal mapa",
    "mapa cavalos portugal",
    "centros equestres mapa",
  ],
  alternates: {
    canonical: `${siteUrl}/mapa`,
  },
  openGraph: {
    title: "Mapa Equestre de Portugal | Portal Lusitano",
    description:
      "Mapa interactivo com coudelarias, centros hípicos, veterinários e eventos equestres em Portugal.",
    url: `${siteUrl}/mapa`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Mapa Equestre de Portugal — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapa Equestre de Portugal | Portal Lusitano",
    description:
      "Mapa interactivo com coudelarias, centros hípicos, veterinários e eventos equestres em Portugal.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Mapa Equestre", url: `${siteUrl}/mapa` },
        ]}
      />
      {children}
    </>
  );
}

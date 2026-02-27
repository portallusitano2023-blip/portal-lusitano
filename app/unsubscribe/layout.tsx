import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cancelar Subscrição",
  description: "Cancele a sua subscrição da newsletter do Portal Lusitano.",
  keywords: [],
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${SITE_URL}/unsubscribe`,
  },
  openGraph: {
    title: "Cancelar Subscrição | Portal Lusitano",
    description: "Cancele a sua subscrição da newsletter do Portal Lusitano.",
    url: `${SITE_URL}/unsubscribe`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Cancelar Subscrição — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cancelar Subscrição | Portal Lusitano",
    description: "Cancele a sua subscrição da newsletter do Portal Lusitano.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Cancelar Subscrição", url: `${SITE_URL}/unsubscribe` },
        ]}
      />
      {children}
    </>
  );
}

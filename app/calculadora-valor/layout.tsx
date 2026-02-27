import type { Metadata } from "next";
import { BreadcrumbSchema, WebApplicationSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Calculadora de Valor",
  description:
    "Calcule o valor estimado de um cavalo Lusitano com base em idade, linhagem, nível de treino, palmarés e conformação. Ferramenta gratuita.",
  keywords: [
    "calculadora valor cavalo",
    "quanto custa cavalo lusitano",
    "preço cavalos portugal",
    "avaliação cavalo lusitano",
    "valor PSL",
  ],
  alternates: {
    canonical: `${SITE_URL}/calculadora-valor`,
  },
  openGraph: {
    title: "Calculadora de Valor | Portal Lusitano",
    description:
      "Calcule o valor estimado de um cavalo Lusitano com base em idade, linhagem, nível de treino, palmarés e conformação. Ferramenta gratuita.",
    url: `${SITE_URL}/calculadora-valor`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Calculadora de Valor - Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Valor | Portal Lusitano",
    description:
      "Calcule o valor estimado de um cavalo Lusitano com base em idade, linhagem, nível de treino, palmarés e conformação. Ferramenta gratuita.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Calculadora de Valor", url: `${SITE_URL}/calculadora-valor` },
        ]}
      />
      <WebApplicationSchema
        name="Calculadora de Valor"
        description="Calcule o valor estimado de um cavalo Lusitano com base em idade, linhagem, nível de treino, palmarés e conformação. Ferramenta gratuita."
        url={`${SITE_URL}/calculadora-valor`}
      />
      {children}
    </>
  );
}

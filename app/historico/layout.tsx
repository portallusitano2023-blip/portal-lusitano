import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "História do Cavalo Lusitano",
  description:
    "Descubra a história milenar do cavalo Lusitano — desde a Península Ibérica antiga até aos dias de hoje. Cronologia, marcos históricos e evolução da raça.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt"}/historico`,
    languages: {
      "pt-PT": `${process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt"}/historico`,
      "en-US": `${process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt"}/en/historico`,
      "es-ES": `${process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt"}/es/historico`,
      "x-default": `${process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt"}/historico`,
    },
  },
  openGraph: {
    title: "História do Cavalo Lusitano | Portal Lusitano",
    description:
      "Descubra a história milenar do cavalo Lusitano — desde a Península Ibérica antiga até aos dias de hoje.",
  },
};

export default function HistoricoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

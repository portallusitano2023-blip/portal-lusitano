import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "História do Cavalo Lusitano",
  description:
    "Descubra a história milenar do cavalo Lusitano — desde a Península Ibérica antiga até aos dias de hoje. Cronologia, marcos históricos e evolução da raça.",
  openGraph: {
    title: "História do Cavalo Lusitano | Portal Lusitano",
    description:
      "Descubra a história milenar do cavalo Lusitano — desde a Península Ibérica antiga até aos dias de hoje.",
  },
};

export default function HistoricoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

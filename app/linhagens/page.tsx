import LinhagensContent from "@/components/linhagens/LinhagensContent";
import { generatePageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = generatePageMetadata({
  title: "Linhagens do Cavalo Lusitano — Veiga, Andrade, Alter Real",
  description:
    "Explore as grandes linhagens do cavalo Lusitano: Veiga, Andrade, Alter Real, Coudelaria Nacional e mais. Genealogia, garanhões fundadores e história.",
  path: "/linhagens",
  keywords: [
    "linhagens lusitano",
    "veiga lusitano",
    "andrade lusitano",
    "alter real",
    "genealogia cavalo lusitano",
    "garanhões fundadores",
  ],
});

export default function LinhagensPage() {
  return <LinhagensContent />;
}

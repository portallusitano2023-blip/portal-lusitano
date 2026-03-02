import PrecosContent from "@/components/precos/PrecosContent";
import { generatePageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = generatePageMetadata({
  title: "Preços e Planos — Portal Lusitano Pro",
  description:
    "Conheça os planos e preços do Portal Lusitano: ferramentas gratuitas, plano Pro com calculadora de valor, comparador e análise de perfil profissional.",
  path: "/precos",
  keywords: ["portal lusitano preços", "plano pro cavalos", "ferramentas equestres preços"],
});

export default function PrecosPage() {
  return <PrecosContent />;
}

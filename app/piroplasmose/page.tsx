import PiroplasmoseContent from "@/components/piroplasmose-page/PiroplasmoseContent";
import { generatePageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = generatePageMetadata({
  title: "Piroplasmose Equina — Guia Completo de Diagnóstico e Tratamento",
  description:
    "Guia completo sobre piroplasmose equina: prevalência em Portugal, impacto na exportação, diagnóstico (IFAT, cELISA, PCR), tratamento e prevenção.",
  path: "/piroplasmose",
  keywords: [
    "piroplasmose equina",
    "babesiose equina",
    "theileria equi",
    "babesia caballi",
    "piroplasmose cavalos portugal",
    "exportação cavalos piroplasmose",
  ],
});

export default function PiroplasmosePage() {
  return <PiroplasmoseContent />;
}

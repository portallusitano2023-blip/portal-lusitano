import SobreContent from "@/components/sobre/SobreContent";
import { generatePageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = generatePageMetadata({
  title: "Sobre o Portal Lusitano — Missão e Equipa",
  description:
    "O Portal Lusitano é a plataforma digital mais completa dedicada ao cavalo Lusitano. Marketplace, directório de coudelarias, ferramentas equestres e arquivo editorial.",
  path: "/sobre",
});

export default function SobrePage() {
  return <SobreContent />;
}

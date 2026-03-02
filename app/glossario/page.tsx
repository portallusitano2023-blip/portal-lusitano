import GlossarioContent from "@/components/glossario/GlossarioContent";
import { generatePageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = generatePageMetadata({
  title: "Glossário Equestre — Termos do Mundo Lusitano",
  description:
    "Glossário completo de termos equestres: dressage, working equitation, atrelagem, anatomia, pelagens e genealogia do cavalo Lusitano.",
  path: "/glossario",
  keywords: [
    "glossário equestre",
    "termos equestres",
    "dicionário cavalos",
    "vocabulário dressage",
    "termos lusitano",
  ],
});

export default function GlossarioPage() {
  return <GlossarioContent />;
}

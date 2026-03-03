import type { Metadata } from "next";
import CursosContent from "@/components/cursos/CursosContent";
import { generatePageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: "Cursos Online — Equitação, Gestão de Coudelarias & Veterinária",
  description:
    "Cursos online sobre equitação, gestão de coudelarias e cuidados veterinários equinos. Aprenda com os melhores profissionais do mundo lusitano.",
  path: "/cursos",
  keywords: [
    "cursos equitação online",
    "gestão coudelarias",
    "veterinária equina curso",
    "formação equestre",
    "aprender dressage",
  ],
});

export default function CursosPage() {
  return <CursosContent />;
}

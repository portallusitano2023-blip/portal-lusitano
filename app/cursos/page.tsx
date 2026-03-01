import type { Metadata } from "next";
import CursosContent from "@/components/cursos/CursosContent";

export const metadata: Metadata = {
  title: "Cursos | Portal Lusitano",
  description:
    "Cursos online sobre equitacao, gestao de coudelarias e cuidados veterinarios. Aprenda com os melhores profissionais do mundo lusitano.",
  openGraph: {
    title: "Cursos | Portal Lusitano",
    description:
      "Cursos online sobre equitacao, gestao de coudelarias e cuidados veterinarios.",
  },
};

export default function CursosPage() {
  return <CursosContent />;
}

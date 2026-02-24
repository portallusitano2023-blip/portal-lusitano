import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Diretório de Profissionais Equestres — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Diret\u00f3rio Profissional",
    title: "Profissionais Equestres",
    subtitle: "Veterinários, ferradores, instrutores e mais — encontre o especialista certo",
  });
}

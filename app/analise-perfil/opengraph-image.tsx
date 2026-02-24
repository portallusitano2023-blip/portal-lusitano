import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Análise de Perfil Equestre — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Ferramenta PRO",
    title: "Análise de Perfil Equestre",
    subtitle: "Descubra o seu perfil como cavaleiro e o Lusitano ideal para si",
  });
}

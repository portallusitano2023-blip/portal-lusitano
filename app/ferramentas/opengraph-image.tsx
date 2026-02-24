import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Ferramentas Equestres PRO — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Portal Lusitano",
    title: "Ferramentas Equestres PRO",
    subtitle: "Calculadora de Valor · Comparador · Compatibilidade · Análise de Perfil",
  });
}

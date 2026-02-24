import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Calculadora de Valor de Cavalos — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Ferramenta PRO",
    title: "Calculadora de Valor",
    subtitle: "Estimativa profissional do valor de mercado do seu cavalo Lusitano",
  });
}

import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Sobre o Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Quem Somos",
    title: "Portal Lusitano",
    subtitle: "A plataforma de referência para o cavalo Lusitano em Portugal e no mundo",
  });
}

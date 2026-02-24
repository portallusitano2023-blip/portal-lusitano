import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Preços e Planos — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Planos",
    title: "Preços e Planos",
    subtitle: "Soluções para criadores, coudelarias e profissionais equestres",
  });
}

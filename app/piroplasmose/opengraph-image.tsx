import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Piroplasmose Equina — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Saúde Equina",
    title: "Piroplasmose Equina",
    subtitle: "Guia completo sobre prevenção, diagnóstico e tratamento",
  });
}

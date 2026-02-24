import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Glossário Equestre — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Referência",
    title: "Glossário Equestre",
    subtitle: "Termos essenciais do mundo dos cavalos Lusitanos, de A a Z",
  });
}

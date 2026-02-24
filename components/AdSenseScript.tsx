"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// Pages where AdSense ads are displayed
const AD_PATHS = [
  "/jornal",
  "/comprar",
  "/directorio",
  "/eventos",
  "/ferramentas",
  "/linhagens",
  "/glossario",
  "/cavalos-famosos",
  "/piroplasmose",
];

export function AdSenseScript() {
  const pathname = usePathname();
  const shouldLoad = AD_PATHS.some((p) => pathname.startsWith(p)) || pathname === "/";

  if (!shouldLoad) return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7254357453133228"
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}

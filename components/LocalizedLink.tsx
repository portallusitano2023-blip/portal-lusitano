"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { ComponentPropsWithoutRef } from "react";

type LinkProps = ComponentPropsWithoutRef<typeof Link>;

/**
 * Drop-in replacement for next/link that automatically
 * prefixes href with /en or /es based on the current language.
 *
 * Portuguese (default locale) keeps the original URL without prefix.
 * External URLs, anchors, and API routes are left untouched.
 */
export default function LocalizedLink({ href, ...props }: LinkProps) {
  const { language } = useLanguage();

  const localizedHref = localizeHref(href, language);

  return <Link href={localizedHref} {...props} />;
}

export function localizeHref(href: LinkProps["href"], language: string): LinkProps["href"] {
  // Only process string hrefs — UrlObjects pass through unchanged
  if (typeof href !== "string") return href;

  // Don't prefix: external URLs, anchors, API routes, admin, static assets
  if (
    href.startsWith("http") ||
    href.startsWith("#") ||
    href.startsWith("/api/") ||
    href.startsWith("/admin") ||
    href.startsWith("/_next/") ||
    href.startsWith("/images/")
  ) {
    return href;
  }

  // Default locale (pt) — no prefix
  if (language === "pt") return href;

  // Already prefixed — don't double-prefix
  if (href.startsWith(`/${language}/`) || href === `/${language}`) {
    return href;
  }

  // Prefix with locale
  return `/${language}${href.startsWith("/") ? "" : "/"}${href}`;
}

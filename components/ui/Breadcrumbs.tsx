"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm text-[var(--foreground-muted)] ${className}`}
    >
      <Link
        href="/"
        className="hover:text-[var(--gold)] transition-colors flex items-center gap-1"
        aria-label={t.common.home}
      >
        <Home size={14} />
      </Link>

      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <ChevronRight size={14} className="text-[var(--foreground-muted)]" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--gold)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--foreground-secondary)]" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

"use client";

import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-widest">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-[var(--foreground-muted)] select-none" aria-hidden="true">
                  /
                </span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-[var(--foreground)] truncate max-w-[200px] sm:max-w-[300px] md:max-w-none"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

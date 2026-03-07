"use client";

import { useState, useEffect, useMemo } from "react";
import { slugifyHeading } from "@/lib/journal-utils";
import { useLanguage } from "@/context/LanguageContext";

interface TOCItem {
  id: string;
  text: string;
  level: "h2" | "h3";
}

interface FloatingTOCProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
  language?: "pt" | "en" | "es";
}

function extractHeadings(body: FloatingTOCProps["body"]): TOCItem[] {
  const headings: TOCItem[] = [];
  body.forEach((block) => {
    if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
      const text =
        block.children?.map((child: { text?: string }) => child.text || "").join("") || "";
      if (text) {
        headings.push({
        id: slugifyHeading(text),
        text,
        level: block.style as "h2" | "h3",
      });
      }
    }
    if (block._type === "articleSection" && block.title) {
      headings.push({
        id: `section-${slugifyHeading(block.title)}`,
        text: block.title,
        level: "h2",
      });
    }
  });
  return headings;
}

export default function FloatingTOC({ body, language = "pt" }: FloatingTOCProps) {
  const headings = useMemo(() => extractHeadings(body), [body]);
  const [activeId, setActiveId] = useState<string>("");
  const { t } = useLanguage();

  useEffect(() => {
    if (headings.length < 3) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  const tocLabel = t.journal.table_of_contents;

  // Number only h2 items
  let h2Counter = 0;

  return (
    <nav
      className="sticky top-24"
      aria-label={
        language === "pt"
          ? "Índice do artigo"
          : language === "es"
            ? "Índice del artículo"
            : "Table of contents"
      }
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-3 h-px bg-[var(--gold)]" />
        <h4 className="text-[8px] uppercase tracking-[0.42em] text-[var(--foreground-muted)] font-medium">
          {tocLabel}
        </h4>
      </div>

      {/* Items */}
      <ul className="space-y-0.5">
        {headings.map((heading) => {
          const isH2 = heading.level === "h2";
          if (isH2) h2Counter++;
          const num = isH2 ? String(h2Counter).padStart(2, "0") : null;
          const isActive = activeId === heading.id;

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(heading.id);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    // Move keyboard focus to the heading so screen readers announce it
                    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
                    el.focus({ preventScroll: true });
                  }
                }}
                className={`
                  flex items-start gap-2.5 py-1.5 px-2 transition-all duration-200 group
                  ${isH2 ? "" : "pl-7"}
                  ${isActive
                    ? "text-[var(--gold)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                  }
                `}
                style={{
                  background: isActive ? "rgba(197,160,89,0.07)" : "transparent",
                  borderLeft: isActive
                    ? "2px solid rgba(197,160,89,0.8)"
                    : "2px solid transparent",
                }}
              >
                {/* Number or indent indicator */}
                {isH2 && num ? (
                  <span
                    className={`flex-shrink-0 font-mono text-[9px] leading-[1.6] tabular-nums transition-colors duration-200 ${
                      isActive ? "text-[var(--gold)]/70" : "text-[var(--foreground-muted)]/40 group-hover:text-[var(--foreground-muted)]/60"
                    }`}
                  >
                    {num}
                  </span>
                ) : (
                  <span
                    className={`flex-shrink-0 mt-[7px] w-1 h-1 rounded-full transition-colors duration-200 ${
                      isActive ? "bg-[var(--gold)]/60" : "bg-[var(--foreground-muted)]/25 group-hover:bg-[var(--foreground-muted)]/40"
                    }`}
                  />
                )}
                <span
                  className={`text-[10px] leading-relaxed transition-colors duration-200 ${
                    isH2 ? "font-medium" : "font-light opacity-80"
                  }`}
                >
                  {heading.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Progress indicator */}
      <div
        className="mt-5 h-px w-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
        aria-hidden
      />
    </nav>
  );
}

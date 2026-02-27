"use client";

import { useState, useEffect } from "react";

interface TOCItem {
  id: string;
  text: string;
}

interface LocalFloatingTOCProps {
  language?: "pt" | "en" | "es";
}

export default function LocalFloatingTOC({ language = "pt" }: LocalFloatingTOCProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from the DOM after render
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('[id^="section-"]');
      const items: TOCItem[] = [];
      elements.forEach((el) => {
        items.push({
          id: el.id,
          text: el.textContent || "",
        });
      });
      setHeadings(items);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver for active heading tracking
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

  return (
    <nav
      className="sticky top-24"
      aria-label={language === "pt" ? "Índice do artigo" : "Table of contents"}
    >
      <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-muted)] mb-4 font-bold">
        {language === "pt" ? "Índice" : "Contents"}
      </h4>
      <ul className="space-y-2 border-l border-[var(--border)]">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`block text-xs leading-relaxed transition-colors border-l-2 -ml-px pl-4 py-1 ${
                activeId === heading.id
                  ? "border-[var(--gold)] text-[var(--gold)]"
                  : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

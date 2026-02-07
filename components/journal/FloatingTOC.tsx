"use client";

import { useState, useEffect, useMemo } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: "h2" | "h3";
}

interface FloatingTOCProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
  language?: "pt" | "en";
}

// Extrair headings do Portable Text body
function extractHeadings(body: FloatingTOCProps["body"]): TOCItem[] {
  const headings: TOCItem[] = [];

  body.forEach((block) => {
    if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
      const text = block.children
        ?.map((child: { text?: string }) => child.text || "")
        .join("") || "";
      if (text) {
        headings.push({
          id: text.toLowerCase().replace(/\s+/g, "-"),
          text,
          level: block.style as "h2" | "h3",
        });
      }
    }
    // Também extrair de articleSection blocks
    if (block._type === "articleSection" && block.title) {
      headings.push({
        id: `section-${block.title.replace(/\s/g, "-")}`,
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

  // Esconder se menos de 3 headings
  if (headings.length < 3) return null;

  return (
    <nav className="sticky top-24" aria-label={language === "pt" ? "Índice do artigo" : "Table of contents"}>
      <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4 font-bold">
        {language === "pt" ? "Índice" : "Contents"}
      </h4>
      <ul className="space-y-2 border-l border-white/10">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className={`block text-xs leading-relaxed transition-colors border-l-2 -ml-[1px] ${
                heading.level === "h3" ? "pl-6" : "pl-4"
              } ${
                activeId === heading.id
                  ? "border-[#C5A059] text-[#C5A059]"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
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

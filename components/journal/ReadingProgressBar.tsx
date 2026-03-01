"use client";

import { useRef, useEffect } from "react";

interface ReadingProgressBarProps {
  language?: "pt" | "en" | "es";
}

export default function ReadingProgressBar({ language = "pt" }: ReadingProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrolled = window.scrollY - articleTop;
      const pct = Math.min(
        Math.max((scrolled / (articleHeight - window.innerHeight)) * 100, 0),
        100
      );
      bar.style.transform = `scaleX(${pct / 100})`;
      bar.setAttribute("aria-valuenow", String(Math.round(pct)));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-[3px] z-50"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={
        language === "pt"
          ? "Progresso de leitura"
          : language === "es"
            ? "Progreso de lectura"
            : "Reading progress"
      }
    >
      <div
        ref={barRef}
        className="h-full bg-[var(--gold)]"
        style={{ transformOrigin: "left", transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>
  );
}

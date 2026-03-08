"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * SmoothScroll — integrates Lenis for butter-smooth scrolling.
 *
 * - Respects prefers-reduced-motion (disables itself)
 * - Synchronizes with requestAnimationFrame
 * - Duration 0.8 for snappy, responsive feel
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafId = useRef(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }
    rafId.current = requestAnimationFrame(raf);

    // Handle anchor link clicks (scroll-to)
    const handleHashClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href?.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -80 });
        }
      }
    };
    document.addEventListener("click", handleHashClick);

    return () => {
      cancelAnimationFrame(rafId.current);
      lenis.destroy();
      lenisRef.current = null;
      document.removeEventListener("click", handleHashClick);
    };
  }, []);

  return null;
}

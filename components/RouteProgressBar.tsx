"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * RouteProgressBar — gold 2px progress bar at the top during route transitions.
 *
 * Works with Next.js App Router by:
 * 1. Intercepting internal <a> clicks to detect navigation START
 * 2. Watching usePathname() changes to detect navigation END
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "completing">("idle");
  const [progress, setProgress] = useState(0);
  const prevPath = useRef(pathname);
  const pathRef = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep pathRef in sync
  pathRef.current = pathname;

  // Navigation complete — finish the bar
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      if (state === "loading") {
        setProgress(100);
        setState("completing");
        timerRef.current = setTimeout(() => {
          setState("idle");
          setProgress(0);
        }, 300);
      }
    }
  }, [pathname, state]);

  // Intercept link clicks to start progress — stable callback using ref
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      // Skip external, hash, mailto, tel links
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank"
      )
        return;
      // Skip same page
      if (href === pathRef.current) return;

      // Start progress
      setState("loading");
      setProgress(20);

      if (timerRef.current) clearTimeout(timerRef.current);

      // Simulate incremental progress
      setTimeout(() => setProgress((p) => Math.max(p, 40)), 150);
      setTimeout(() => setProgress((p) => Math.max(p, 60)), 400);
      setTimeout(() => setProgress((p) => Math.max(p, 78)), 800);
    };

    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (state === "idle") return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 2,
        zIndex: 99990,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "var(--gold, rgb(197, 160, 89))",
          transition:
            state === "completing"
              ? "width 0.2s ease-out, opacity 0.3s ease 0.1s"
              : "width 0.4s ease-out",
          opacity: state === "completing" ? 0 : 1,
          boxShadow: "0 0 10px rgba(197, 160, 89, 0.5)",
        }}
      />
    </div>
  );
}

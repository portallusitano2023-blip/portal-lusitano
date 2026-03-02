"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdUnitProps {
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  /** Specific ad slot ID from AdSense dashboard. If omitted, uses auto ad format. */
  slot?: string;
}

/**
 * Google AdSense ad unit with IntersectionObserver lazy-loading.
 * Only initialises the ad when the container enters the viewport,
 * preventing layout shift and wasted impressions on off-screen ads.
 */
export default function AdUnit({ format = "auto", className = "", slot }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const pushed = useRef(false);

  // Observe visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Push ad once visible
  useEffect(() => {
    if (!isVisible || pushed.current) return;
    pushed.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded (ad-blocker, localhost, etc.) — fail silently
    }
  }, [isVisible]);

  const minHeight =
    format === "horizontal"
      ? "min-h-[90px]"
      : format === "rectangle"
        ? "min-h-[250px]"
        : "min-h-[100px]";

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${minHeight} ${className}`}
      aria-hidden="true"
    >
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-7254357453133228"
          data-ad-format={format}
          data-full-width-responsive="true"
          {...(slot ? { "data-ad-slot": slot } : {})}
        />
      )}
    </div>
  );
}

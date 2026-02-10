"use client";

import { useState, useEffect } from "react";

// Hook: detectar entrada no viewport uma vez (IntersectionObserver nativo)
export function useInViewOnce(ref: React.RefObject<HTMLElement | null>, margin = "-40px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin]);
  return inView;
}

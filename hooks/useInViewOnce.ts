"use client";

import { useState, useEffect, type RefObject } from "react";

export function useInViewOnce(ref: RefObject<HTMLElement | null>, margin = "-50px") {
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

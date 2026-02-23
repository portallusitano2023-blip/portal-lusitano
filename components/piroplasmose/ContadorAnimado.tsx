"use client";

import { useRef, useEffect } from "react";

// Contador animado - requestAnimationFrame nativo com DOM directo (sem re-renders React)
export function ContadorAnimado({ valor, cor }: { valor: string; cor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const match = valor.match(/(\d+\.?\d*)/);
  const num = match ? parseFloat(match[1]) : 0;
  const prefix = match ? valor.substring(0, match.index) : "";
  const suffix = match ? valor.substring((match.index || 0) + match[1].length) : valor;
  const hasDecimal = match ? match[1].includes(".") : false;

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current || !num) return;
    const span = el.querySelector("[data-counter]") as HTMLSpanElement | null;
    if (!span) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 1200;
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = num * eased;
            span.textContent = hasDecimal ? current.toFixed(1) : Math.round(current).toString();
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [num, hasDecimal]);

  if (!match)
    return (
      <div ref={ref} className={`text-xl sm:text-2xl font-bold ${cor}`}>
        {valor}
      </div>
    );

  return (
    <div ref={ref} className={`text-xl sm:text-2xl font-bold ${cor} tabular-nums`}>
      {prefix}
      <span data-counter>0</span>
      {suffix}
    </div>
  );
}

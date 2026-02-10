"use client";

import { useRef, useState, useEffect } from "react";

// Contador animado - requestAnimationFrame nativo (sem dependencia framer-motion)
export function ContadorAnimado({ valor, cor }: { valor: string; cor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayVal, setDisplayVal] = useState("0");
  const hasAnimated = useRef(false);
  const match = valor.match(/(\d+\.?\d*)/);
  const num = match ? parseFloat(match[1]) : 0;
  const prefix = match ? valor.substring(0, match.index) : "";
  const suffix = match ? valor.substring((match.index || 0) + match[1].length) : valor;
  const hasDecimal = match ? match[1].includes(".") : false;

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current || !num) return;
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
            setDisplayVal(hasDecimal ? current.toFixed(1) : Math.round(current).toString());
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
      {displayVal}
      {suffix}
    </div>
  );
}

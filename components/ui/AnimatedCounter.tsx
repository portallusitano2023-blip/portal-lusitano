"use client";

import { useRef, useEffect } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInViewOnce(ref, "-50px");

  useEffect(() => {
    if (!inView || !numberRef.current) return;

    let startTime: number;
    let frame: number;

    const step = (timestamp: number) => {
      if (!numberRef.current) return;
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      // Direct DOM update - zero React re-renders during animation
      numberRef.current.textContent = Math.floor(eased * end).toLocaleString();

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span ref={numberRef}>0</span>
      {suffix}
    </span>
  );
}

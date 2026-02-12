"use client";

import { useState, useEffect, useRef } from "react";

interface MarketBenchmark {
  label: string;
  value: number;
}

interface MarketPositionChartProps {
  estimatedValue: number;
  benchmarks: MarketBenchmark[];
  currency?: string;
}

export default function MarketPositionChart({
  estimatedValue,
  benchmarks,
  currency = "€",
}: MarketPositionChartProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const allValues = [...benchmarks.map((b) => b.value), estimatedValue];
  const maxVal = Math.max(...allValues) * 1.15;
  const minVal = Math.min(...allValues) * 0.85;
  const range = maxVal - minVal;

  const getPosition = (val: number) => ((val - minVal) / range) * 100;

  const estimatedPos = getPosition(estimatedValue);

  const formatValue = (val: number) => `${val.toLocaleString("pt-PT")}${currency}`;

  return (
    <div ref={ref} className="space-y-4">
      {/* Main position bar */}
      <div className="relative">
        {/* Track */}
        <div className="h-3 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-emerald-500/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500/40 via-amber-500/40 to-emerald-500/40 rounded-full transition-all duration-1000 ease-out"
            style={{ width: animated ? "100%" : "0%" }}
          />
        </div>

        {/* Estimated value marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-1500 ease-out"
          style={{
            left: animated ? `${estimatedPos}%` : "0%",
            transitionDuration: "1.5s",
          }}
        >
          <div className="relative">
            {/* Diamond marker */}
            <div className="w-5 h-5 bg-[#C5A059] rotate-45 rounded-sm shadow-lg shadow-[#C5A059]/30 -ml-2.5 -mt-1" />
            {/* Label above */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="bg-[#C5A059] text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                {formatValue(estimatedValue)}
              </div>
              <div className="w-2 h-2 bg-[#C5A059] rotate-45 mx-auto -mt-1" />
            </div>
          </div>
        </div>

        {/* Benchmark markers */}
        {benchmarks.map((b, i) => {
          const pos = getPosition(b.value);
          return (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
              style={{
                left: animated ? `${pos}%` : "0%",
                transitionDelay: `${i * 150}ms`,
                transitionDuration: "1.2s",
              }}
            >
              <div className="w-0.5 h-6 bg-white/20 -ml-px" />
            </div>
          );
        })}
      </div>

      {/* Benchmark labels */}
      <div className="space-y-2">
        {benchmarks.map((b, i) => {
          const isAbove = estimatedValue >= b.value;
          const diff = ((estimatedValue - b.value) / b.value) * 100;
          return (
            <div
              key={i}
              className="flex items-center justify-between text-sm opacity-0 transition-all duration-500"
              style={{
                opacity: animated ? 1 : 0,
                transitionDelay: `${800 + i * 100}ms`,
              }}
            >
              <span className="text-[var(--foreground-muted)]">{b.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-[var(--foreground-secondary)] font-medium">
                  {formatValue(b.value)}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isAbove ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {isAbove ? "+" : ""}
                  {diff.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

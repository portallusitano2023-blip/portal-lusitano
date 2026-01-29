"use client";

import { useState, useEffect } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preloader rápido - 600ms (antes 1200ms)
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-center preloader-exit"
      aria-hidden
    >
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide">
          PORTAL LUSITANO
        </h1>
        <div className="absolute -bottom-2 left-0 h-[1px] bg-[#C5A059] w-full max-w-0 preloader-line" />
      </div>
      <div className="w-48 h-[1px] bg-zinc-800 overflow-hidden">
        <div className="h-full bg-[#C5A059] w-0 preloader-bar" />
      </div>
      <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-zinc-600">
        A carregar experiência...
      </p>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-red-600 font-bold uppercase">Leilão Terminado</span>;

  return (
    <div className="flex gap-3 font-mono text-xl">
      <div className="text-center">
        <span className="block text-[#C5A059] leading-none">{timeLeft.d}d</span>
      </div>
      <span className="text-gray-700">:</span>
      <div className="text-center">
        <span className="block text-[#C5A059] leading-none">{timeLeft.h}h</span>
      </div>
      <span className="text-gray-700">:</span>
      <div className="text-center">
        <span className="block text-[#C5A059] leading-none">{timeLeft.m}m</span>
      </div>
      <span className="text-gray-700">:</span>
      <div className="text-center">
        <span className="block text-[#C5A059] leading-none animate-pulse">{timeLeft.s}s</span>
      </div>
    </div>
  );
}
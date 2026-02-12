"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "circle" | "rect";
}

const GOLD_PALETTE = [
  "#C5A059",
  "#D4AF6A",
  "#B8956F",
  "#E8D5A3",
  "#A68A4B",
  "#F0E6CC",
  "#917539",
  "#FFFFFF",
];

export default function Confetti({ trigger, duration = 3000, particleCount = 60 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!trigger || hasTriggered.current) return;
    hasTriggered.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const particles: Particle[] = [];

    // Create particles from center-top
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height * 0.3 + (Math.random() - 0.5) * 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 3 + Math.random() * 5,
        color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        opacity: 0.8 + Math.random() * 0.2,
        shape: Math.random() > 0.5 ? "circle" : "rect",
      });
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const fadeProgress = Math.max(0, (elapsed - duration * 0.6) / (duration * 0.4));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.vx *= 0.99; // air resistance
        p.rotation += p.rotationSpeed;

        const alpha = p.opacity * (1 - fadeProgress);
        if (alpha <= 0) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [trigger, duration, particleCount]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

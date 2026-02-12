"use client";

import { useRef, useCallback, type ReactNode, type MouseEvent } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      // Direct DOM update - no React re-renders
      ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "translate3d(0,0,0)";
    }
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-btn ${className}`}
      style={{ display: "inline-block" }}
    >
      {children}
    </div>
  );
}

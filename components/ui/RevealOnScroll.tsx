"use client";

import { useRef, type ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";

type AnimationVariant = "fade-up" | "fade-left" | "fade-right" | "fade-scale" | "blur-up";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: AnimationVariant;
  distance?: number;
}

const getStyles = (variant: AnimationVariant, visible: boolean, distance: number) => {
  if (visible) return { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "blur(0px)" };

  switch (variant) {
    case "fade-up":
      return {
        opacity: 0,
        transform: `translate3d(0, ${distance}px, 0) scale(1)`,
        filter: "blur(8px)",
      };
    case "fade-left":
      return {
        opacity: 0,
        transform: `translate3d(-${distance}px, 0, 0) scale(1)`,
        filter: "blur(8px)",
      };
    case "fade-right":
      return {
        opacity: 0,
        transform: `translate3d(${distance}px, 0, 0) scale(1)`,
        filter: "blur(8px)",
      };
    case "fade-scale":
      return { opacity: 0, transform: "translate3d(0,0,0) scale(0.92)", filter: "blur(6px)" };
    case "blur-up":
      return {
        opacity: 0,
        transform: `translate3d(0, ${distance * 0.5}px, 0) scale(1)`,
        filter: "blur(12px)",
      };
  }
};

export default function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  duration = 800,
  variant = "fade-up",
  distance = 40,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(ref, "-80px");

  const styles = getStyles(variant, inView, distance);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...styles,
        transition: `opacity ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms, filter ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
        willChange: inView ? "auto" : "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}

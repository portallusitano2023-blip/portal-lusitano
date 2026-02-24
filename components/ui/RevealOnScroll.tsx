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
  const usesBlur = variant === "blur-up";
  if (visible) {
    const base = { opacity: 1, transform: "translate3d(0,0,0) scale(1)" };
    return usesBlur ? { ...base, filter: "blur(0px)" } : base;
  }

  switch (variant) {
    case "fade-up":
      return { opacity: 0, transform: `translate3d(0, ${distance}px, 0) scale(1)` };
    case "fade-left":
      return { opacity: 0, transform: `translate3d(-${distance}px, 0, 0) scale(1)` };
    case "fade-right":
      return { opacity: 0, transform: `translate3d(${distance}px, 0, 0) scale(1)` };
    case "fade-scale":
      return { opacity: 0, transform: "translate3d(0,0,0) scale(0.92)" };
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
  duration = 500,
  variant = "fade-up",
  distance = 24,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(ref, "0px");

  const styles = getStyles(variant, inView, distance);

  const easing = `cubic-bezier(0.25,0.46,0.45,0.94)`;
  const usesBlur = variant === "blur-up";
  const transitionProps = usesBlur
    ? `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms, filter ${duration}ms ${easing} ${delay}ms`
    : `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...styles,
        transition: transitionProps,
        willChange: inView
          ? "auto"
          : usesBlur
            ? "opacity, transform, filter"
            : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

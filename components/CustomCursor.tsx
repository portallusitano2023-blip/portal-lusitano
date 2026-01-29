"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isHoveringRef = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>();

  useEffect(() => {
    // Esconder em mobile e touch devices
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const isTouch = "ontouchstart" in window;
    if (isMobile || isTouch) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        isHoveringRef.current = true;
        if (cursorRingRef.current) {
          cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0) scale(1.5)`;
          cursorRingRef.current.style.opacity = "1";
        }
      }
    };

    const onMouseOut = () => {
      isHoveringRef.current = false;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.opacity = "0.4";
      }
    };

    // Loop de animacao otimizado
    const animate = () => {
      // Cursor principal - segue instantaneamente
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mousePos.current.x - 4}px, ${mousePos.current.y - 4}px, 0)`;
      }

      // Anel - interpola suavemente (mais rapido que antes)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.2;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.2;

      if (cursorRingRef.current) {
        const scale = isHoveringRef.current ? 1.5 : 1;
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0) scale(${scale})`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#C5A059] rounded-full pointer-events-none z-[9999]"
        style={{ willChange: "transform" }}
      />
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-10 h-10 border border-[#C5A059]/40 rounded-full pointer-events-none z-[9998]"
        style={{ willChange: "transform", transition: "opacity 0.15s" }}
      />
      <style jsx global>{`
        @media (min-width: 769px) and (hover: hover) {
          *, *::before, *::after { cursor: none !important; }
        }
      `}</style>
    </>
  );
}

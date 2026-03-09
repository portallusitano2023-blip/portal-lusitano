"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * CustomCursor — gold dot + trail for desktop (pointer: fine).
 *
 * - Dot moves INSTANTLY on mousemove (no RAF delay)
 * - 3 trail particles follow with fast lerp via RAF
 * - Contextual label from [data-cursor-text]
 * - Respects prefers-reduced-motion
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const pos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef<{ x: number; y: number }[]>([]);
  const visible = useRef(false);
  const raf = useRef(0);
  const moving = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const TRAIL_COUNT = 3;

  const setTrailRef = useCallback((el: HTMLDivElement | null, i: number) => {
    if (el) trailRefs.current[i] = el;
  }, []);

  // Trail-only RAF loop — stops when trail converges (idle cursor)
  const animateTrail = useCallback(() => {
    let needsUpdate = false;
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const target = i === 0 ? pos.current : trailPositions.current[i - 1];
      const tp = trailPositions.current[i];
      if (!tp || !target) continue;

      const dx = target.x - tp.x;
      const dy = target.y - tp.y;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        needsUpdate = true;
        tp.x += dx * 0.45;
        tp.y += dy * 0.45;
      }

      const el = trailRefs.current[i];
      if (el) {
        el.style.transform = `translate3d(${tp.x}px, ${tp.y}px, 0) translate(-50%, -50%)`;
      }
    }

    if (needsUpdate) {
      raf.current = requestAnimationFrame(animateTrail);
    } else {
      moving.current = false;
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches || reducedMotion.matches) return;

    for (let i = 0; i < TRAIL_COUNT; i++) {
      trailPositions.current[i] = { x: -100, y: -100 };
    }

    const style = document.createElement("style");
    style.id = "custom-cursor-hide";
    style.textContent = "html, body, a, button, input, textarea, select, label, [role='button'], [data-cursor-text] { cursor: none !important; }";
    document.head.appendChild(style);

    const show = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      trailRefs.current.forEach((el) => { if (el) el.style.opacity = "1"; });
    };

    const hide = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (labelRef.current) labelRef.current.style.opacity = "0";
      trailRefs.current.forEach((el) => { if (el) el.style.opacity = "0"; });
    };

    // Dot moves DIRECTLY in mousemove — zero frame delay
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY + 20}px, 0) translate(-50%, -50%)`;
      }

      if (!visible.current) {
        visible.current = true;
        for (let i = 0; i < TRAIL_COUNT; i++) {
          trailPositions.current[i] = { x: e.clientX, y: e.clientY };
        }
        show();
      }

      // Restart RAF loop if idle
      if (!moving.current) {
        moving.current = true;
        raf.current = requestAnimationFrame(animateTrail);
      }
    };

    const onLeave = () => { visible.current = false; hide(); };
    const onEnter = () => { visible.current = true; show(); };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const textEl = target.closest("[data-cursor-text]") as HTMLElement | null;
      if (textEl && labelRef.current) {
        labelRef.current.textContent = textEl.dataset.cursorText || "";
        labelRef.current.style.opacity = "1";
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as Element;
      const textEl = target.closest("[data-cursor-text]") as HTMLElement | null;
      if (textEl && labelRef.current) {
        labelRef.current.style.opacity = "0";
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    moving.current = true;
    raf.current = requestAnimationFrame(animateTrail);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf.current);
      clearTimeout(idleTimer.current);
      style.remove();
    };
  }, [animateTrail]);

  return (
    <>
      {/* Trail particles */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => setTrailRef(el, i)}
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: Math.max(2, 4 - i),
            height: Math.max(2, 4 - i),
            borderRadius: "50%",
            background: `rgba(197,160,89,${0.3 - i * 0.08})`,
            pointerEvents: "none",
            zIndex: 99998,
            opacity: 0,
            willChange: "transform",
          }}
        />
      ))}
      {/* Main dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "rgb(197,160,89)",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          willChange: "transform",
        }}
      />
      {/* Contextual label */}
      <div
        ref={labelRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 99997,
          opacity: 0,
          fontSize: "7px",
          fontFamily: "monospace",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "rgb(197,160,89)",
          whiteSpace: "nowrap",
          transition: "opacity 0.15s",
          willChange: "transform",
        }}
      />
    </>
  );
}

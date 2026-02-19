"use client";

import { useRef, useCallback, type ReactNode, type MouseEvent, type TouchEvent } from "react";

interface HorizontalScrollGalleryProps {
  children: ReactNode;
  className?: string;
}

export default function HorizontalScrollGallery({
  children,
  className = "",
}: HorizontalScrollGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Use refs instead of state to avoid re-renders on every mouse move
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  // RAF ref ensures scroll mutations are batched to the next frame — eliminates jank
  const rafId = useRef(0);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    const target = scrollLeft.current - walk;
    // Throttle DOM write to animation frame — prevents layout thrash on high-frequency events
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollLeft = target;
    });
  }, []);

  const handleEnd = useCallback(() => {
    isDragging.current = false;
    cancelAnimationFrame(rafId.current);
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!scrollRef.current) return;
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    const target = scrollLeft.current - walk;
    // Same RAF throttling for touch events
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollLeft = target;
    });
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollRef}
        className="scroll-gallery cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
      >
        {children}
      </div>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none z-10" />
    </div>
  );
}

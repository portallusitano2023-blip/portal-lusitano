"use client";

import { useRef, useState, type ReactNode, type MouseEvent, type TouchEvent } from "react";

interface HorizontalScrollGalleryProps {
  children: ReactNode;
  className?: string;
}

export default function HorizontalScrollGallery({
  children,
  className = "",
}: HorizontalScrollGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleEnd = () => setIsDragging(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (!scrollRef.current) return;
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollRef}
        className={`scroll-gallery ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
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

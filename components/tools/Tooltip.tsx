"use client";

import { useState, useRef } from "react";
import { Info } from "lucide-react";

interface TooltipProps {
  text: string;
  children?: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative inline-flex items-center" ref={ref}>
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors p-0.5"
        aria-label="Mais informação"
      >
        {children || <Info size={14} />}
      </button>
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-[var(--background-card)] border border-[var(--border)] text-[var(--foreground-secondary)] text-xs px-3 py-2 rounded-lg shadow-lg max-w-[220px] whitespace-normal leading-relaxed">
            {text}
          </div>
          <div className="w-2 h-2 bg-[var(--background-card)] border-r border-b border-[var(--border)] rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
}

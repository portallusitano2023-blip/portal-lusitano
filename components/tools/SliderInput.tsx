"use client";

import Tooltip from "./Tooltip";

interface SliderInputProps {
  label: string;
  description?: string;
  tooltip?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  color?: string;
}

export default function SliderInput({
  label,
  description,
  tooltip,
  value,
  onChange,
  min = 1,
  max = 10,
  color = "#C5A059",
}: SliderInputProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <label className="text-sm text-[var(--foreground-secondary)]">{label}</label>
          {description && (
            <span className="text-xs text-[var(--foreground-muted)] hidden sm:inline">
              {description}
            </span>
          )}
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        <span className="font-medium text-lg" style={{ color }}>
          {value}/{max}
        </span>
      </div>
      <div className="relative h-2 bg-[var(--background-card)] rounded-full my-5">
        <div
          className="absolute h-full rounded-full transition-all duration-150"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute -top-5 -bottom-5 left-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 shadow-lg transition-all duration-150 pointer-events-none"
          style={{
            left: `calc(${percentage}% - 8px)`,
            backgroundColor: color,
            borderColor: color,
          }}
        />
      </div>
    </div>
  );
}

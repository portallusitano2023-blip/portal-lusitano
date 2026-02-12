"use client";

import { useState } from "react";

interface BodyZone {
  id: string;
  label: string;
  score: number; // 1-10
  path: string;
}

interface HorseSilhouetteProps {
  zones: {
    cabeca?: number;
    pescoco?: number;
    espadua?: number;
    dorso?: number;
    garupa?: number;
    membros?: number;
  };
  size?: number;
  labels?: {
    cabeca?: string;
    pescoco?: string;
    espadua?: string;
    dorso?: string;
    garupa?: string;
    membros?: string;
  };
}

const getScoreColor = (score: number): string => {
  if (score >= 8) return "#22c55e";
  if (score >= 6) return "#C5A059";
  if (score >= 4) return "#f59e0b";
  return "#ef4444";
};

const getScoreOpacity = (score: number): number => {
  return 0.15 + (score / 10) * 0.45;
};

export default function HorseSilhouette({ zones, size = 400, labels = {} }: HorseSilhouetteProps) {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const defaultLabels = {
    cabeca: labels.cabeca || "Cabeça & Pescoço",
    pescoco: labels.pescoco || "Pescoço",
    espadua: labels.espadua || "Espádua & Peito",
    dorso: labels.dorso || "Dorso",
    garupa: labels.garupa || "Garupa",
    membros: labels.membros || "Membros & Aprumos",
  };

  // Horse outline (elegant side profile, facing right)
  // ViewBox: 0 0 500 360
  const bodyZones: BodyZone[] = [
    {
      id: "cabeca",
      label: defaultLabels.cabeca,
      score: zones.cabeca ?? 5,
      // Head - forehead, muzzle, jaw
      path: "M 95,85 C 85,75 78,68 72,72 C 65,77 58,88 55,100 C 52,108 50,118 52,125 C 54,132 60,138 68,140 C 72,141 80,140 88,137 C 95,134 100,128 105,120 C 108,114 110,105 108,95 C 106,88 100,84 95,85 Z",
    },
    {
      id: "pescoco",
      label: defaultLabels.pescoco,
      score: zones.pescoco ?? zones.cabeca ?? 5,
      // Neck - connecting head to body
      path: "M 105,120 C 110,128 118,140 130,152 C 142,164 155,172 168,178 C 175,181 182,182 188,180 L 188,148 C 180,135 170,122 158,112 C 146,102 132,95 120,92 C 112,90 105,92 100,97 C 97,100 96,106 98,112 C 100,116 102,118 105,120 Z",
    },
    {
      id: "espadua",
      label: defaultLabels.espadua,
      score: zones.espadua ?? 5,
      // Shoulder and chest area
      path: "M 168,178 C 175,181 185,183 188,180 L 188,148 C 190,150 192,155 195,165 C 198,175 200,188 200,200 C 200,215 198,228 195,238 C 193,245 190,250 186,252 L 175,252 C 178,242 180,230 180,218 C 180,205 178,192 174,182 C 172,178 170,176 168,178 Z",
    },
    {
      id: "dorso",
      label: defaultLabels.dorso,
      score: zones.dorso ?? 5,
      // Back/barrel
      path: "M 188,148 C 210,140 235,138 260,138 C 285,138 310,142 330,148 L 330,180 C 328,195 325,210 322,222 C 320,230 316,238 312,245 L 186,252 C 190,250 193,245 195,238 C 198,228 200,215 200,200 C 200,188 198,175 195,165 C 192,155 190,150 188,148 Z",
    },
    {
      id: "garupa",
      label: defaultLabels.garupa,
      score: zones.garupa ?? 5,
      // Croup and hindquarters
      path: "M 330,148 C 350,155 365,162 375,172 C 385,182 390,195 392,210 C 393,220 392,232 388,242 C 385,248 380,252 375,255 L 312,245 C 316,238 320,230 322,222 C 325,210 328,195 330,180 Z",
    },
    {
      id: "membros",
      label: defaultLabels.membros,
      score: zones.membros ?? 5,
      // Front and back legs (simplified as regions)
      path: "M 186,252 L 195,252 C 196,265 197,280 196,295 C 195,308 193,318 190,325 L 180,328 C 183,318 185,308 185,295 C 185,280 184,265 186,252 Z M 200,252 L 210,252 C 211,265 212,280 211,295 C 210,308 208,318 205,325 L 195,328 C 198,318 200,308 200,295 C 200,280 199,265 200,252 Z M 330,245 L 340,245 C 342,260 343,275 342,290 C 341,305 339,315 336,322 L 326,325 C 329,315 331,305 331,290 C 331,275 330,260 330,245 Z M 350,248 L 360,248 C 362,263 363,278 362,293 C 361,308 359,318 356,325 L 346,328 C 349,318 351,308 351,293 C 351,278 350,263 350,248 Z",
    },
  ];

  // Tail
  const tailPath =
    "M 392,210 C 398,205 405,198 412,195 C 418,193 425,195 430,200 C 435,206 438,215 438,225 C 438,235 435,245 430,252 C 425,258 418,260 412,258 C 405,255 400,248 395,240 C 392,234 390,226 392,218 Z";

  // Mane
  const manePath =
    "M 100,88 C 105,82 115,78 125,80 C 135,82 145,88 152,96 C 158,104 162,112 164,120 C 165,125 164,130 160,132 C 155,128 148,118 140,110 C 132,102 122,96 112,92 C 106,90 100,90 100,88 Z";

  // Ear
  const earPath =
    "M 88,78 C 85,68 84,58 86,52 C 88,48 92,46 95,50 C 98,54 99,62 98,72 C 97,76 95,80 92,82 Z";

  const activeData = activeZone ? bodyZones.find((z) => z.id === activeZone) : null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size * 0.72} viewBox="0 0 500 360" className="select-none">
          {/* Subtle ground shadow */}
          <ellipse cx="270" cy="340" rx="180" ry="8" fill="rgba(255,255,255,0.03)" />

          {/* Tail */}
          <path
            d={tailPath}
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          {/* Body zones (interactive) */}
          {bodyZones.map((zone) => {
            const isActive = activeZone === zone.id;
            const color = getScoreColor(zone.score);
            const opacity = getScoreOpacity(zone.score);

            return (
              <path
                key={zone.id}
                d={zone.path}
                fill={`${color}`}
                fillOpacity={isActive ? opacity + 0.15 : opacity}
                stroke={isActive ? color : "rgba(255,255,255,0.15)"}
                strokeWidth={isActive ? 2 : 1}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setActiveZone(zone.id)}
                onMouseLeave={() => setActiveZone(null)}
                style={{
                  filter: isActive ? `drop-shadow(0 0 8px ${color}50)` : "none",
                }}
              />
            );
          })}

          {/* Mane (decorative) */}
          <path
            d={manePath}
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.8"
          />

          {/* Ear */}
          <path
            d={earPath}
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.8"
          />

          {/* Eye */}
          <circle cx="82" cy="95" r="3" fill="rgba(255,255,255,0.3)" />

          {/* Outline overlay for elegance */}
          <path
            d="M 86,52 C 84,58 85,68 88,78 C 92,82 95,85 95,85 C 85,75 78,68 72,72 C 65,77 58,88 55,100 C 52,108 50,118 52,125 C 54,132 60,138 68,140 C 80,140 95,134 105,120 C 110,128 130,152 168,178 C 175,181 188,183 188,180 L 188,148 C 210,140 260,138 330,148 C 350,155 375,172 392,210 C 398,205 425,195 430,200 C 438,215 438,235 430,252 C 418,260 400,248 392,218"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>

        {/* Tooltip */}
        {activeData && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-[var(--background)]/95 backdrop-blur-sm border border-[var(--border)] rounded-lg px-4 py-2.5 shadow-xl pointer-events-none z-10"
            style={{ minWidth: 180 }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-[var(--foreground)]">
                {activeData.label}
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: getScoreColor(activeData.score) }}
              >
                {activeData.score}/10
              </span>
            </div>
            <div className="mt-1.5 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(activeData.score / 10) * 100}%`,
                  backgroundColor: getScoreColor(activeData.score),
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 text-xs text-[var(--foreground-muted)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          <span>8-10</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]/60" />
          <span>6-7</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <span>4-5</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span>1-3</span>
        </div>
      </div>
    </div>
  );
}

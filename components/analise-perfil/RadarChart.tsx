"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { RadarChartData } from "@/components/analise-perfil/types";

interface RadarChartProps {
  data: RadarChartData;
}

export default function RadarChart({ data }: RadarChartProps) {
  const { t } = useLanguage();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const labels = [
    { key: "competicao", label: t.analise_perfil.radar_competition },
    { key: "tradicao", label: t.analise_perfil.radar_tradition },
    { key: "criacao", label: t.analise_perfil.radar_breeding },
    { key: "lazer", label: t.analise_perfil.radar_leisure },
    { key: "investimento", label: t.analise_perfil.radar_investment },
    { key: "dedicacao", label: t.analise_perfil.radar_dedication },
  ];

  const cX = 150;
  const cY = 150;
  const mR = 100;

  const pts = labels.map((item, i) => {
    const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const v = data[item.key as keyof RadarChartData] / 100;
    const r = animate ? v * mR : 0;
    return {
      x: cX + r * Math.cos(a),
      y: cY + r * Math.sin(a),
      lX: cX + (mR + 25) * Math.cos(a),
      lY: cY + (mR + 25) * Math.sin(a),
      label: item.label,
    };
  });

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        {[0.25, 0.5, 0.75, 1].map((l) => (
          <polygon
            key={l}
            points={labels
              .map((_, i) => {
                const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
                return `${cX + l * mR * Math.cos(a)},${cY + l * mR * Math.sin(a)}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        {labels.map((_, i) => {
          const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={cX}
              y1={cY}
              x2={cX + mR * Math.cos(a)}
              y2={cY + mR * Math.sin(a)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}
        <path
          d={path}
          fill="rgba(197, 160, 89, 0.2)"
          stroke="#C5A059"
          strokeWidth="2"
          style={{ opacity: 0, animation: "fadeSlideIn 0.8s ease-out forwards" }}
        />
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill="#C5A059"
            style={{
              opacity: 0,
              animation: "scaleIn 0.3s ease-out forwards",
              animationDelay: `${0.5 + i * 0.1}s`,
              transformOrigin: "center",
            }}
          />
        ))}
        {pts.map((p, i) => (
          <text
            key={i}
            x={p.lX}
            y={p.lY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-zinc-400 text-[10px]"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, AlertTriangle, Target, Shield } from "lucide-react";

interface HorseVerdictCardProps {
  nome: string;
  score: number; // 0-100
  strengths: string[]; // top 3 strength descriptions
  weaknesses: string[]; // top 3 weakness descriptions
  bestUse: string; // "Competicao" | "Criacao" | "Lazer" | "Investimento"
  riskLevel: "Baixo" | "Medio" | "Alto";
  recommendation: string; // 1-paragraph recommendation text
}

/* ------------------------------------------------------------------ */
/*  Score ring – self-contained SVG with animated stroke               */
/* ------------------------------------------------------------------ */
function ScoreRing({ value, animated }: { value: number; animated: boolean }) {
  const size = 96;
  const strokeWidth = 6;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - strokeWidth) / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const progress = animated ? value : 0;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true" focusable="false">
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--border, rgba(255,255,255,0.1))"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--gold, #C5A059)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
            filter: "drop-shadow(0 0 6px rgba(197,160,89,0.35))",
          }}
        />
      </svg>
      {/* Centre number */}
      <span
        className="absolute inset-0 flex items-center justify-center font-serif font-bold"
        style={{ color: "var(--gold, #C5A059)", fontSize: size * 0.3 }}
        aria-label={`Pontuacao ${value} de 100`}
      >
        {animated ? value : 0}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Risk-level colour mapping                                          */
/* ------------------------------------------------------------------ */
function riskStyles(level: HorseVerdictCardProps["riskLevel"]): {
  bg: string;
  text: string;
  border: string;
} {
  switch (level) {
    case "Baixo":
      return {
        bg: "rgba(34,197,94,0.1)",
        text: "#22c55e",
        border: "rgba(34,197,94,0.3)",
      };
    case "Medio":
      return {
        bg: "rgba(245,158,11,0.1)",
        text: "#f59e0b",
        border: "rgba(245,158,11,0.3)",
      };
    case "Alto":
      return {
        bg: "rgba(239,68,68,0.1)",
        text: "#ef4444",
        border: "rgba(239,68,68,0.3)",
      };
  }
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function HorseVerdictCard({
  nome,
  score,
  strengths,
  weaknesses,
  bestUse,
  riskLevel,
  recommendation,
}: HorseVerdictCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  /* Scroll-triggered fade-in via IntersectionObserver */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const risk = riskStyles(riskLevel);

  return (
    <article
      ref={cardRef}
      role="region"
      aria-label={`Veredicto para ${nome}`}
      className="verdict-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition:
          "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        background: "var(--background-card, #111111)",
        border: "1px solid var(--border, rgba(255,255,255,0.1))",
        borderRadius: "1rem",
        padding: "1.5rem",
        maxWidth: "720px",
        width: "100%",
      }}
    >
      {/* ---------- HEADER ---------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <ScoreRing value={score} animated={visible} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            className="font-serif"
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--foreground, #ededed)",
              margin: 0,
              lineHeight: 1.25,
              overflowWrap: "break-word",
            }}
          >
            {nome}
          </h3>
          <p
            style={{
              margin: "0.25rem 0 0",
              fontSize: "0.8125rem",
              color: "var(--foreground-muted, #71717a)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Veredicto do Cavalo
          </p>
        </div>
      </div>

      {/* ---------- STRENGTHS / WEAKNESSES GRID ---------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Strengths */}
        <div
          style={{
            background: "var(--background-secondary, #0a0a0a)",
            border: "1px solid var(--border, rgba(255,255,255,0.1))",
            borderRadius: "0.75rem",
            padding: "1rem",
          }}
        >
          <h4
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#34d399",
              margin: "0 0 0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <CheckCircle size={14} aria-hidden="true" />
            Pontos Fortes
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }} aria-label="Pontos fortes">
            {strengths.slice(0, 3).map((s, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  color: "var(--foreground-secondary, #a1a1aa)",
                  lineHeight: 1.5,
                  marginBottom: i < strengths.length - 1 ? "0.5rem" : 0,
                }}
              >
                <CheckCircle
                  size={14}
                  style={{ color: "#34d399", flexShrink: 0, marginTop: "0.2rem" }}
                  aria-hidden="true"
                />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div
          style={{
            background: "var(--background-secondary, #0a0a0a)",
            border: "1px solid var(--border, rgba(255,255,255,0.1))",
            borderRadius: "0.75rem",
            padding: "1rem",
          }}
        >
          <h4
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#fb923c",
              margin: "0 0 0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <AlertTriangle size={14} aria-hidden="true" />
            Pontos Fracos
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }} aria-label="Pontos fracos">
            {weaknesses.slice(0, 3).map((w, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  color: "var(--foreground-secondary, #a1a1aa)",
                  lineHeight: 1.5,
                  marginBottom: i < weaknesses.length - 1 ? "0.5rem" : 0,
                }}
              >
                <AlertTriangle
                  size={14}
                  style={{ color: "#fb923c", flexShrink: 0, marginTop: "0.2rem" }}
                  aria-hidden="true"
                />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- BOTTOM ROW: badges + recommendation ---------- */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "1rem",
        }}
      >
        {/* Best-use badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            borderRadius: "9999px",
            background: "rgba(197,160,89,0.1)",
            color: "var(--gold, #C5A059)",
            border: "1px solid rgba(197,160,89,0.25)",
          }}
        >
          <Target size={13} aria-hidden="true" />
          {bestUse}
        </span>

        {/* Risk-level badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            borderRadius: "9999px",
            background: risk.bg,
            color: risk.text,
            border: `1px solid ${risk.border}`,
          }}
        >
          <Shield size={13} aria-hidden="true" />
          Risco {riskLevel}
        </span>
      </div>

      {/* Recommendation paragraph */}
      <p
        style={{
          margin: 0,
          fontSize: "0.875rem",
          lineHeight: 1.65,
          color: "var(--foreground-secondary, #a1a1aa)",
        }}
      >
        {recommendation}
      </p>

      {/* ---------- Hover glow styles (injected once) ---------- */}
      <style>{`
        .verdict-card:hover {
          border-color: rgba(197, 160, 89, 0.35) !important;
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.08), 0 0 2px rgba(197, 160, 89, 0.12);
        }
        .verdict-card:focus-within {
          outline: 2px solid var(--gold, #C5A059);
          outline-offset: 2px;
        }
      `}</style>
    </article>
  );
}

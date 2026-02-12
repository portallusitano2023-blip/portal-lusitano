"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  horses,
  connections,
  clusters,
  horseMap,
  type ConstellationHorse,
} from "./constellation-data";
import { usePrefersReducedMotion, useIsMobile } from "@/hooks";

type Phase = "hidden" | "stars" | "lines" | "labels" | "complete";

interface Props {
  phase: Phase;
  onHorseClick: (horse: ConstellationHorse) => void;
}

export default function LusitanoConstellation({ phase, onHorseClick }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    horse: ConstellationHorse;
    x: number;
    y: number;
  } | null>(null);
  const [svgWidth, setSvgWidth] = useState(800);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Connected IDs for highlight
  const connectedIds = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const ids = new Set<string>();
    connections.forEach((c) => {
      if (c.fromId === hoveredId) ids.add(c.toId);
      if (c.toId === hoveredId) ids.add(c.fromId);
    });
    return ids;
  }, [hoveredId]);

  // Cluster horse IDs for cluster hover
  const hoveredClusterIds = useMemo(() => {
    if (!hoveredCluster) return new Set<string>();
    const cluster = clusters.find((c) => c.id === hoveredCluster);
    return cluster ? new Set(cluster.horseIds) : new Set<string>();
  }, [hoveredCluster]);

  // Parallax mouse effect (desktop only, respects reduced motion)
  useEffect(() => {
    if (isMobile || reducedMotion || !groupRef.current) return;
    let rafId: number;
    const handleMove = (e: MouseEvent) => {
      rafId = requestAnimationFrame(() => {
        if (!groupRef.current || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = ((e.clientX - cx) / rect.width) * 8;
        const dy = ((e.clientY - cy) / rect.height) * 5;
        groupRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile, reducedMotion]);

  // Track SVG width in state so we don't access ref during render
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSvgWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleTooltip = useCallback(
    (horse: ConstellationHorse | null, e?: React.MouseEvent | React.FocusEvent) => {
      if (!horse || !e || !svgRef.current) {
        setTooltip(null);
        return;
      }
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((e as React.MouseEvent).clientX ?? rect.left) - rect.left;
      const svgY = ((e as React.MouseEvent).clientY ?? rect.top) - rect.top;
      setTooltip({ horse, x: svgX, y: svgY });
    },
    []
  );

  const handleKeyDown = useCallback(
    (horse: ConstellationHorse, e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onHorseClick(horse);
      }
    },
    [onHorseClick]
  );

  const showStars = phase !== "hidden";
  const showLines = phase === "lines" || phase === "labels" || phase === "complete";
  const showLabels = phase === "labels" || phase === "complete";
  const instant = phase === "complete" && reducedMotion;

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        className="w-full h-auto"
        role="img"
        aria-label="Constelação interactiva dos cavalos lusitanos famosos"
      >
        <defs>
          {/* Star glow filter */}
          <filter id="star-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="star-glow-active" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cluster gradients */}
          {clusters.map((cluster) => (
            <radialGradient key={cluster.id} id={`grad-${cluster.id}`}>
              <stop offset="0%" stopColor={cluster.color} stopOpacity="0.08" />
              <stop offset="100%" stopColor={cluster.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        <g ref={groupRef} id="constellation-group">
          {/* Layer 1: Cluster halos */}
          {showLabels &&
            clusters.map((cluster) => (
              <circle
                key={`halo-${cluster.id}`}
                cx={cluster.cx}
                cy={cluster.cy}
                r={cluster.radius}
                fill={`url(#grad-${cluster.id})`}
                opacity={hoveredCluster === cluster.id ? 0.6 : hoveredCluster ? 0.1 : 0.3}
                className={instant ? "" : "constellation-label"}
                style={{ transition: "opacity 0.3s" }}
              />
            ))}

          {/* Layer 2: Connection lines */}
          {showLines &&
            connections.map((conn) => {
              const from = horseMap.get(conn.fromId);
              const to = horseMap.get(conn.toId);
              if (!from || !to) return null;
              const isHighlighted = hoveredId === conn.fromId || hoveredId === conn.toId;
              return (
                <line
                  key={`line-${conn.fromId}-${conn.toId}`}
                  x1={from.cx}
                  y1={from.cy}
                  x2={to.cx}
                  y2={to.cy}
                  stroke={conn.isCrossCluster ? "#8B7355" : "#C5A059"}
                  strokeWidth={isHighlighted ? 1.5 : 0.8}
                  strokeOpacity={isHighlighted ? 0.8 : 0.3}
                  strokeDasharray={conn.isCrossCluster ? "6 4" : "none"}
                  className={instant ? "" : "constellation-line"}
                  style={{ transition: "stroke-width 0.3s, stroke-opacity 0.3s" }}
                />
              );
            })}

          {/* Layer 3: Horse nodes */}
          {showStars &&
            horses.map((horse, i) => {
              const isHovered = hoveredId === horse.id;
              const isConnected = connectedIds.has(horse.id);
              const isClusterHovered = hoveredClusterIds.has(horse.id);
              const isActive = isHovered || isConnected || isClusterHovered;
              const isDimmed = (hoveredId || hoveredCluster) && !isActive;
              const starSize = horse.isFounder ? 7 : 5;

              return (
                <g
                  key={horse.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${horse.nome}, ${horse.anos}, ${horse.disciplina}`}
                  className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
                  style={{
                    opacity: instant ? (isDimmed ? 0.3 : 1) : undefined,
                    animation: instant
                      ? "none"
                      : `constellationStarIn 0.5s ease-out ${i * 50}ms both`,
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    setHoveredId(horse.id);
                    handleTooltip(horse, e);
                  }}
                  onMouseMove={(e) => handleTooltip(horse, e)}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    setTooltip(null);
                  }}
                  onFocus={(e) => {
                    setHoveredId(horse.id);
                    handleTooltip(horse, e);
                  }}
                  onBlur={() => {
                    setHoveredId(null);
                    setTooltip(null);
                  }}
                  onClick={() => onHorseClick(horse)}
                  onKeyDown={(e) => handleKeyDown(horse, e)}
                  filter={isActive ? "url(#star-glow-active)" : "url(#star-glow)"}
                >
                  {/* Outer glow */}
                  <circle
                    cx={horse.cx}
                    cy={horse.cy}
                    r={starSize + 4}
                    fill="#C5A059"
                    opacity={isActive ? 0.2 : 0.05}
                    style={{ transition: "opacity 0.3s" }}
                  />
                  {/* Main star */}
                  <circle
                    cx={horse.cx}
                    cy={horse.cy}
                    r={starSize}
                    fill={isDimmed ? "#555" : "#C5A059"}
                    opacity={isDimmed ? 0.3 : 1}
                    style={{ transition: "fill 0.3s, opacity 0.3s" }}
                  />
                  {/* Inner core */}
                  <circle
                    cx={horse.cx}
                    cy={horse.cy}
                    r={starSize - 2}
                    fill={isDimmed ? "#777" : "#E8D5A0"}
                    opacity={isDimmed ? 0.2 : 0.6}
                    style={{ transition: "fill 0.3s, opacity 0.3s" }}
                  />
                  {/* Crown for founders */}
                  {horse.isFounder && (
                    <text
                      x={horse.cx}
                      y={horse.cy - starSize - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isDimmed ? "#555" : "#C5A059"}
                      style={{ transition: "fill 0.3s" }}
                    >
                      ♕
                    </text>
                  )}
                  {/* Name label */}
                  <text
                    x={horse.cx}
                    y={horse.cy + starSize + 14}
                    textAnchor="middle"
                    fontSize="9"
                    fill={isDimmed ? "#444" : "#C5A059"}
                    fontFamily="serif"
                    fontStyle="italic"
                    opacity={isDimmed ? 0.3 : 0.8}
                    style={{ transition: "fill 0.3s, opacity 0.3s" }}
                  >
                    {horse.nome}
                  </text>
                </g>
              );
            })}

          {/* Layer 4: Cluster labels */}
          {showLabels &&
            clusters.map((cluster) => (
              <text
                key={`label-${cluster.id}`}
                x={cluster.cx}
                y={cluster.cy - cluster.radius - 10}
                textAnchor="middle"
                fontSize="10"
                fill={cluster.color}
                opacity={hoveredCluster === cluster.id ? 0.9 : hoveredCluster ? 0.2 : 0.5}
                fontWeight="600"
                letterSpacing="0.15em"
                className={`cursor-pointer ${instant ? "" : "constellation-label"}`}
                style={{ transition: "opacity 0.3s", textTransform: "uppercase" }}
                onMouseEnter={() => setHoveredCluster(cluster.id)}
                onMouseLeave={() => setHoveredCluster(null)}
              >
                {cluster.nome}
              </text>
            ))}
        </g>
      </svg>

      {/* HTML Tooltip overlay */}
      {tooltip && !isMobile && (
        <div
          className="absolute pointer-events-none z-50 bg-[var(--background)]/95 border border-[var(--gold)]/30 rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm"
          style={{
            left: Math.min(tooltip.x + 12, svgWidth - 180),
            top: tooltip.y - 60,
            maxWidth: 200,
          }}
        >
          <p className="text-[var(--gold)] text-xs font-serif font-semibold">
            {tooltip.horse.nome}
          </p>
          <p className="text-[var(--foreground-secondary)] text-[10px]">{tooltip.horse.anos}</p>
          <p className="text-[var(--foreground-muted)] text-[10px]">{tooltip.horse.disciplina}</p>
        </div>
      )}
    </div>
  );
}

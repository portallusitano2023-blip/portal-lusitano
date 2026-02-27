"use client";

interface COIGaugeProps {
  coi: number;
}

export default function COIGauge({ coi }: COIGaugeProps) {
  // COI range: 0-12%, gauge is semicircular
  const maxCOI = 12;
  const clampedCOI = Math.min(Math.max(coi, 0), maxCOI);
  const percentage = clampedCOI / maxCOI;

  // Color thresholds
  const color = coi <= 3 ? "#22c55e" : coi <= 6.25 ? "#f59e0b" : "#ef4444";
  const label = coi <= 3 ? "Excelente" : coi <= 6.25 ? "Aceitável" : "Elevado";

  // SVG semicircle arc
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2 + 10;

  // Arc from 180° (left) to 0° (right) — semicircle
  const startAngle = Math.PI;
  const endAngle = 0;
  const sweepAngle = startAngle - (startAngle - endAngle) * percentage;

  const arcStart = {
    x: centerX + radius * Math.cos(startAngle),
    y: centerY - radius * Math.sin(startAngle),
  };
  const arcEnd = {
    x: centerX + radius * Math.cos(sweepAngle),
    y: centerY - radius * Math.sin(sweepAngle),
  };
  const fullArcEnd = {
    x: centerX + radius * Math.cos(endAngle),
    y: centerY - radius * Math.sin(endAngle),
  };

  const largeArc = percentage > 0.5 ? 1 : 0;

  const bgPath = `M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 1 1 ${fullArcEnd.x} ${fullArcEnd.y}`;
  const valuePath =
    percentage > 0
      ? `M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 ${largeArc} 1 ${arcEnd.x} ${arcEnd.y}`
      : "";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        {/* Background arc */}
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Value arc */}
        {valuePath && (
          <path
            d={valuePath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`,
              strokeDasharray: 500,
              strokeDashoffset: 500,
              animation: "gaugeReveal 1.2s ease-out 0.3s forwards",
            }}
          />
        )}
        {/* Center value */}
        <text
          x={centerX}
          y={centerY - 12}
          textAnchor="middle"
          fill={color}
          fontSize="28"
          fontWeight="700"
          fontFamily="inherit"
        >
          {coi.toFixed(1)}%
        </text>
        {/* Label */}
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          fill={color}
          fontSize="11"
          fontWeight="600"
          opacity={0.8}
        >
          {label}
        </text>
        {/* Scale labels */}
        <text
          x={arcStart.x + 2}
          y={centerY + 20}
          fill="rgba(255,255,255,0.4)"
          fontSize="9"
          textAnchor="middle"
        >
          0%
        </text>
        <text
          x={fullArcEnd.x - 2}
          y={centerY + 20}
          fill="rgba(255,255,255,0.4)"
          fontSize="9"
          textAnchor="middle"
        >
          {maxCOI}%
        </text>
        <text
          x={centerX}
          y={centerY - radius - 6}
          fill="rgba(255,255,255,0.3)"
          fontSize="8"
          textAnchor="middle"
        >
          Média PSL: ~4%
        </text>
      </svg>
      <style jsx>{`
        @keyframes gaugeReveal {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

const RadarChart = ({
  cavalos,
  labels,
}: {
  cavalos: { nome: string; valores: number[]; cor: string }[];
  labels: string[];
}) => {
  const size = 280;
  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (2 * Math.PI) / labels.length;

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 10) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      className="mx-auto w-full"
      style={{ height: "auto", maxWidth: `${size}px` }}
    >
      {/* Grid circles */}
      {[2, 4, 6, 8, 10].map((level) => (
        <polygon
          key={level}
          points={labels
            .map((_, i) => {
              const p = getPoint(level, i);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {labels.map((_, i) => {
        const p = getPoint(10, i);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        );
      })}
      {/* Data polygons */}
      {cavalos.map((cavalo, ci) => (
        <polygon
          key={ci}
          points={cavalo.valores
            .map((v, i) => {
              const p = getPoint(v, i);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill={`${cavalo.cor}20`}
          stroke={cavalo.cor}
          strokeWidth="2"
          style={{ opacity: 0, animation: `fadeSlideIn 0.5s ease-out ${ci * 0.2}s forwards` }}
        />
      ))}
      {/* Labels */}
      {labels.map((label, i) => {
        const p = getPoint(12, i);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            fill="rgba(255,255,255,0.6)"
            fontSize="10"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

export default RadarChart;

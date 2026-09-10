'use client';

interface RadarPoint {
  label: string;
  value: number;
  max?: number;
}

interface RadarChartProps {
  data: RadarPoint[];
  size?: number;
  color?: string;
}

export default function RadarChart({ data, size = 280, color = '#22d3ee' }: RadarChartProps) {
  if (data.length < 3) {
    // A radar chart needs at least 3 axes to be meaningful/legible.
    return (
      <div className="flex h-[220px] w-full items-center justify-center text-sm text-slate-500">
        Add at least 3 subjects to see the radar breakdown.
      </div>
    );
  }

  const center = size / 2;
  const radius = size / 2 - 40;
  const angleStep = (Math.PI * 2) / data.length;
  const rings = [0.25, 0.5, 0.75, 1];

  const points = data.map((d, i) => {
    const max = d.max ?? 100;
    const ratio = Math.max(0, Math.min(1, d.value / max));
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: center + radius * ratio * Math.cos(angle),
      y: center + radius * ratio * Math.sin(angle),
      labelX: center + (radius + 24) * Math.cos(angle),
      labelY: center + (radius + 24) * Math.sin(angle),
      axisX: center + radius * Math.cos(angle),
      axisY: center + radius * Math.sin(angle),
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size}>
      {rings.map((r, idx) => {
        const ringPoints = data
          .map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            return `${center + radius * r * Math.cos(angle)},${center + radius * r * Math.sin(angle)}`;
          })
          .join(' ');
        return <polygon key={idx} points={ringPoints} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />;
      })}

      {points.map((p, i) => (
        <line key={i} x1={center} y1={center} x2={p.axisX} y2={p.axisY} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      ))}

      <polygon points={polygonPoints} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={2} />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} />
      ))}

      {data.map((d, i) => (
        <text
          key={i}
          x={points[i].labelX}
          y={points[i].labelY}
          fill="#cbd5e1"
          fontSize={11}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {d.label.length > 12 ? `${d.label.slice(0, 11)}…` : d.label}
        </text>
      ))}
    </svg>
  );
}

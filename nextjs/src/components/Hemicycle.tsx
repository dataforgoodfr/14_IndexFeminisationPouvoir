import type React from "react";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface AssembleeNationaleProps {
  title?: string;
  segments?: Segment[];
}

const defaultSegments: Segment[] = [
  { label: "Audience", value: 46, color: "#b8b0d8" },
  { label: "Earnings", value: 24, color: "#7ec8e3" },
  { label: "Sales", value: 15, color: "#00e5c6" },
];

const Hemicycle: React.FC<AssembleeNationaleProps> = ({
  title = "Assemblée Nationale",
  segments = defaultSegments,
}) => {
  const size = 220;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Arc goes from 180° (left) to 360° (right) — a half circle
  const startAngle = 180;
  const totalAngle = 180;
  const gapDeg = 4; // gap between segments in degrees

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleDeg: number,
  ) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(angleRad),
      y: centerY + r * Math.sin(angleRad),
    };
  };

  const describeArc = (startDeg: number, endDeg: number): string => {
    const start = polarToCartesian(cx, cy, radius, startDeg);
    const end = polarToCartesian(cx, cy, radius, endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  // Calculate total value for proportional sizing
  const totalValue = segments.reduce((sum, s) => sum + s.value, 0);

  // Build arc segments
  let currentAngle = startAngle;
  const arcs = segments.map((seg, i) => {
    const segAngle = (seg.value / totalValue) * totalAngle;
    const arcStart = currentAngle + (i === 0 ? 0 : gapDeg / 2);
    const arcEnd = currentAngle + segAngle - gapDeg / 2;
    currentAngle += segAngle;
    return { ...seg, arcStart, arcEnd };
  });

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "32px 28px 24px",
        maxWidth: 300,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#1a1a2e",
          margin: "0 0 20px",
        }}
      >
        {title}
      </h2>

      {/* Gauge */}
      <svg
        width={size}
        height={size / 2 + strokeWidth}
        viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
        style={{ overflow: "visible" }}
      >
        <title>{title}</title>
        {/* Background track */}
        <path
          d={describeArc(startAngle, startAngle + totalAngle)}
          fill="none"
          stroke="#f0eef6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Colored segments */}
        {arcs.map((arc, i) => (
          <path
            key={i}
            d={describeArc(arc.arcStart, arc.arcEnd)}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Legend */}
      <div style={{ marginTop: 24, textAlign: "left", paddingLeft: 8 }}>
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  border: `2px solid ${seg.color}`,
                  display: "inline-block",
                  boxSizing: "border-box",
                }}
              />
              <span style={{ fontSize: 14, color: "#6b7280" }}>
                {seg.label}
              </span>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
              }}
            >
              {seg.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hemicycle;

/** biome-ignore-all lint/suspicious/noArrayIndexKey: static data */
import type React from "react";

interface GaugeProps {
  /** Value between 0 and 100 */
  value: number;
  /** Label text displayed above the percentage */
  label: string;
  /** Size (width) of the component in pixels */
  size?: number;
  fontSize?: number;
  /** Color of the filled portion of the arc */
  fillColor?: string;
  /** Color of the text */
  textColor?: string;
  /** Color of the unfilled track */
  trackColor?: string;
}

const Gauge: React.FC<GaugeProps> = ({
  value,
  label,
  size = 300,
  fontSize = 22,
  fillColor = "#878D96",
  trackColor = "#D9D9D9",
  textColor = "#4A2D8A",
}) => {
  const strokeWidth = size * 0.1;
  const halfStroke = strokeWidth / 2;
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const startAngleDeg = 135;
  const sweepAngle = 270;

  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  const polarToCartesian = (angleDeg: number) => {
    const rad = degToRad(angleDeg);
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  };

  // The arc endpoints (bottom-left and bottom-right)
  const trackStart = polarToCartesian(startAngleDeg);
  const trackEnd = polarToCartesian(startAngleDeg + sweepAngle);

  // The lowest y-point of the arc endpoints + stroke
  // The endpoints are at 135° and 45° (from top), which sit at:
  //   y = centerY + radius * sin(45°) ≈ centerY + radius * 0.707
  const bottomY = Math.max(trackStart.y, trackEnd.y) + halfStroke;
  const viewBoxHeight = bottomY;

  // Background track
  const trackPath = [
    `M ${trackStart.x} ${trackStart.y}`,
    `A ${radius} ${radius} 0 1 1 ${trackEnd.x} ${trackEnd.y}`,
  ].join(" ");

  // Filled arc
  const clampedValue = Math.min(100, Math.max(0, value));
  const fillSweep = (clampedValue / 100) * sweepAngle;
  const fillEnd = polarToCartesian(startAngleDeg + fillSweep);
  const largeArcFlag = fillSweep > 180 ? 1 : 0;
  const fillPath = [
    `M ${trackStart.x} ${trackStart.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${fillEnd.x} ${fillEnd.y}`,
  ].join(" ");

  const labelLines = label.split("\n");
  const labelFontSize = fontSize;
  const valueFontSize = fontSize * 1.5;
  const lineHeight = labelFontSize * 1.25;

  // Vertically center the text block within the arc
  const totalTextHeight = labelLines.length * lineHeight + valueFontSize;
  const textBlockStartY = centerY - totalTextHeight / 2 + labelFontSize;

  // Aspect ratio for the wrapper
  const aspectRatio = size / viewBoxHeight;

  return (
    <div
      style={{
        display: "inline-block",
        width: size,
        aspectRatio: aspectRatio,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${viewBoxHeight}`}
        aria-hidden={true}
        aria-description={`${labelLines.join(" ")} ${clampedValue}%`}
      >
        {/* Background track */}
        <path
          d={trackPath}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Filled arc */}
        {clampedValue > 0 && (
          <path
            d={fillPath}
            fill="none"
            stroke={fillColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}

        {/* Label lines */}
        {labelLines.map((line, i) => (
          <text
            key={i}
            x={centerX}
            y={textBlockStartY + i * lineHeight}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={textColor}
            fontWeight="700"
            fontSize={labelFontSize}
          >
            {line}
          </text>
        ))}

        {/* Percentage value */}
        <text
          x={centerX}
          y={
            textBlockStartY +
            labelLines.length * lineHeight +
            valueFontSize * 0.45
          }
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textColor}
          fontWeight="900"
          fontSize={valueFontSize}
        >
          {clampedValue}%
        </text>
      </svg>
    </div>
  );
};

export default Gauge;

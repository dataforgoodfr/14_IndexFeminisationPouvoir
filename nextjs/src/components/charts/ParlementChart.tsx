import { cn } from "@/lib/utils";

type ParlementChartProps = {
  className?: string;
  /** proportion de femmes au parlement (0 à 1) */
  parite: number;
};

export default function ParlementChart({
  className,
  parite,
}: ParlementChartProps) {
  const rows = 8;
  const innerRadius = 72;
  const rowGap = 20;
  const dotRadius = 4;
  const dotsStart = 14;
  const dotsStep = 4;

  const width = 560;
  const height = 300;
  const centerX = width / 2;
  const centerY = height - 30;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hemicycle du Parlement sous forme de points"
      className={cn("w-full h-auto", className)}
    >
      <title>Hemicycle du Parlement</title>
      {Array.from({ length: rows }, (_, rowIndex) => {
        const radius = innerRadius + rowIndex * rowGap;
        const dotCount = dotsStart + rowIndex * dotsStep;

        return Array.from({ length: dotCount }, (_, dotIndex) => {
          const ratio = dotCount === 1 ? 0 : dotIndex / (dotCount - 1);
          const angle = Math.PI * (1 - ratio);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY - radius * Math.sin(angle);

          return (
            <circle
              key={`dot-${x.toFixed(2)}-${y.toFixed(2)}`}
              cx={x}
              cy={y}
              r={dotRadius}
              fill={
                dotIndex / (dotCount - 1) < parite
                  ? "var(--color-foundations-violet-principal)"
                  : "var(--color-foundations-violet-clair)"
              }
            />
          );
        });
      })}
    </svg>
  );
}

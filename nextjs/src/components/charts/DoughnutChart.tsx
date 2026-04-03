import type { ComponentType, SVGProps } from "react";

type Props = {
  value: number;
  className?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};
export const DoughhnutChart = ({ value, className, icon: Icon }: Props) => {
  const normalizedValue = 100 - Math.max(0, Math.min(100, value));
  const center = 136;
  const startAngle = -90 + 12; // Décalage de 15 degrés pour que le début du graphique soit à 12h05
  const radius = 95;
  const strokeWidth = 42;
  const circumference = 2 * Math.PI * radius;
  const filledLength = (normalizedValue / 100) * circumference;

  return (
    <svg
      viewBox="0 0 272 272"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Graphique en anneau représentant une valeur de ${value}% de femmes pour ce pouvoir`}
      className={className}
    >
      <g transform={`rotate(${startAngle} ${center} ${center})`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="var(--color-foundations-violet-clair)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          strokeDasharray={`${filledLength} ${circumference - filledLength}`}
          strokeLinecap="butt"
          fill="none"
        />
      </g>
      <g transform="translate(136 136)">
        <Icon
          x={-34.5}
          y={-34.5}
          width={69}
          height={69}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    </svg>
  );
};

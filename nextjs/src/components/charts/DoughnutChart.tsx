import type { ComponentType, SVGProps } from "react";

type Props = {
  value: number;
  className?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  /**
   * "dark" (default): designed for dark/purple backgrounds — track is violet-clair,
   * the non-women arc is erased with white to reveal the track color for women.
   * "light": designed for white backgrounds — track is violet-très-clair,
   * the women arc is drawn in violet-principal.
   */
  variant?: "dark" | "light";
};
export const DoughhnutChart = ({
  value,
  className,
  icon: Icon,
  variant = "dark",
}: Props) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const center = 136;
  const startAngle = -90 + 12; // Décalage de 15 degrés pour que le début du graphique soit à 12h05
  const radius = 95;
  const strokeWidth = 42;
  const circumference = 2 * Math.PI * radius;

  const trackColor =
    variant === "light"
      ? "var(--color-foundations-viole-tres-clair)"
      : "var(--color-foundations-violet-clair)";

  const arcColor =
    variant === "light" ? "var(--color-foundations-violet-principal)" : "white";

  // dark: overlay erases (100-value)% starting from top → women portion = violet-clair arc
  // light: overlay draws value% starting from top → women portion = violet-principal arc
  const arcLength =
    variant === "light"
      ? (clampedValue / 100) * circumference
      : ((100 - clampedValue) / 100) * circumference;

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
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={arcColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeLinecap="butt"
          fill="none"
        />
      </g>
      {Icon && (
        <g transform="translate(136 136)">
          <Icon
            x={-34.5}
            y={-34.5}
            width={69}
            height={69}
            preserveAspectRatio="xMidYMid meet"
            className="fill-white"
          />
        </g>
      )}
    </svg>
  );
};

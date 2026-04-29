import type { ComponentType, SVGProps } from "react";

type Props = {
  value: number;
  className?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  iconProps?: SVGProps<SVGSVGElement> & { width: number; height: number };
  /**
   * "dark" (défaut) : conçu pour les fonds sombres/violets — la piste est violet-clair,
   * l'arc non-femmes est effacé en blanc pour révéler la couleur de piste pour les femmes.
   * "light" : conçu pour les fonds blancs — la piste est violet-très-clair,
   * l'arc femmes est tracé en violet-principal.
   */
  variant?: "dark" | "light";
};
export const DoughnutChart = ({
  value,
  className,
  icon: Icon,
  variant = "dark",
  iconProps = {
    width: 69,
    height: 69,
  },
}: Props) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const center = 136;
  const startAngle = -90 + 12; // Décalage de 15 degrés pour que le début du graphique soit à 12h05
  const radius = 95;
  const strokeWidth = 42;
  const circumference = 2 * Math.PI * radius;

  const trackColor =
    variant === "light"
      ? "var(--color-foundations-violet-tres-clair)"
      : "var(--color-foundations-violet-clair)";

  const iconColor =
    variant === "light"
    ? "fill-foundations-violet-principal"
    : "fill-white";

  const arcColor =
    variant === "light" ? "var(--color-foundations-violet-principal)" : "white";

  // dark : l'overlay efface (100-valeur)% depuis le haut → portion femmes = arc violet-clair
  // light : l'overlay trace valeur% depuis le haut → portion femmes = arc violet-principal
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
            preserveAspectRatio="xMidYMid meet"
            className={iconColor}
            {...iconProps}
            x={-iconProps.width / 2}
            y={-iconProps.height / 2}
          />
        </g>
      )}
    </svg>
  );
};

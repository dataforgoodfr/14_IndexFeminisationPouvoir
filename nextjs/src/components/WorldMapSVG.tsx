import { WORLD_PATHS } from "./world-map-paths";

type WorldMapSVGProps = {
  femmeAmbassadrices: string[];
  fillColorDefault?: string;
  fillColorFemme?: string;
  className?: string;
};

export const WorldMapSVG = ({
  femmeAmbassadrices,
  fillColorDefault = "var(--color-purple-oxfam-200)",
  fillColorFemme = "var(--color-purple-oxfam-600)",
  className,
}: WorldMapSVGProps) => {
  const highlightCSS = femmeAmbassadrices.length > 0
    ? `${femmeAmbassadrices.map((id) => `#${id}`).join(",")} { fill: ${fillColorFemme}; }`
    : "";

  return (
    <svg
      viewBox="0 0 689 453"
      className={className}
      aria-label="Carte mondiale des ambassadrices de France"
      role="img"
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted static CSS targeting SVG IDs */}
      {highlightCSS && <style dangerouslySetInnerHTML={{ __html: highlightCSS }} />}
      {WORLD_PATHS.map((country) => (
        <path
          key={country.id}
          id={country.id}
          d={country.d}
          fill={fillColorDefault}
          stroke="white"
          strokeWidth={0.5}
        />
      ))}
    </svg>
  );
};

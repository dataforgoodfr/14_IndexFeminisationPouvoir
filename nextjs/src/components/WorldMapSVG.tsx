import worldData from "@/data/maps_world_svg.json";

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
  const femmeSet = new Set(femmeAmbassadrices);
  return (
    <svg
      viewBox={worldData.viewBox}
      className={className}
      aria-label="Carte mondiale des ambassadrices de France"
      role="img"
    >
      {worldData.countries.map((country) => (
        <path
          key={country.id}
          id={country.id}
          d={country.d}
          fill={femmeSet.has(country.id) ? fillColorFemme : fillColorDefault}
          stroke="white"
          strokeWidth={0.5}
        />
      ))}
    </svg>
  );
};

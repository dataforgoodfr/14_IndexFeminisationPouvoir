import type {
  DataMapsProps,
  MapRegionSVGProps,
} from "@/components/FranceMapSVG";
import { ArrowDownIcon } from "@/components/icons/arrow-down";
import { ArrowUpIcon } from "@/components/icons/arrow-up";
import DataMapSVG from "@/data/maps_svg.json";
import { cn } from "@/lib/utils";
import { ClickablePath } from "./ClickableMap";

type OutreMerMapSVGProps = React.SVGProps<SVGSVGElement> &
  MapRegionSVGProps & {
    onTerritoryClick?: (regionName: string) => void;
  };

export const OutreMerMapSVG = ({
  fillColor = "#f2e100",
  strokeColor = "white",
  strokeWidth = 0,
  regionName = "Guadeloupe",
  clickable = false,
  text = "",
  textCoordinates = { x: 25, y: 25 },
  className = "",
  iconType = "none",
  onTerritoryClick,
  ...props
}: OutreMerMapSVGProps) => {
  const data_maps_svg = DataMapSVG as DataMapsProps;

  const outreMerList = data_maps_svg["outre-mer"].map((item) => item.nom);

  if (!outreMerList.includes(regionName as string)) {
    return <div>Carte non trouvée</div>;
  }

  for (const name of outreMerList) {
    if (name === regionName) {
      const d = data_maps_svg["outre-mer"].find((item) => item.nom === name)?.d;
      const ariaLabel = data_maps_svg["outre-mer"].find(
        (item) => item.nom === name,
      )?.["aria-label"];
      const viewBox = data_maps_svg["outre-mer"].find(
        (item) => item.nom === name,
      )?.viewBox;

      const [, , vbWidth, vbHeight] = (viewBox ?? "0 0 100 100").split(" ");
      return (
        <svg
          viewBox={viewBox}
          width={vbWidth}
          height={vbHeight}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={ariaLabel}
          role="img"
          {...props}
          className={cn("", className)}
        >
          {clickable && (
            <ClickablePath
              ariaLabel={regionName}
              d={d}
              fillColor={fillColor}
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
              text={text}
              iconType={iconType}
              className={className}
              textCoordinates={textCoordinates}
              onTerritoryChange={onTerritoryClick}
            />
          )}
          {!clickable && (
            <path
              d={d}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          )}
        </svg>
      );
    }
  }
};

type OutreMerGridProps = {
  dataPerRegion?: Record<
    string,
    {
      percentage: number | null;
      evolution: number | null;
    }
  >;
  onRegionChange?: (regionName: string) => void;
};

export const OutreMerGrid = ({
  dataPerRegion,
  onRegionChange,
}: OutreMerGridProps) => {
  const data_maps_svg = DataMapSVG as DataMapsProps;
  const OutreMerNameList = data_maps_svg["outre-mer"].slice(0, 8);

  const outreMerDivHtml = OutreMerNameList.map((om) => {
    const percentage =
      dataPerRegion?.[om.nom]?.percentage !== null
        ? dataPerRegion?.[om.nom].percentage
        : "--";
    const evolution = dataPerRegion?.[om.nom]?.evolution || 0;
    const isEvolutionPositive = evolution > 0;
    const isEvolutionNegative = evolution < 0;
    return (
      <div
        key={om.nom}
        className="flex flex-col items-center justify-center -gap-[6px]"
      >
        <div className="flex-6 flex justify-center items-end w-27.5 h-30 overflow-hidden">
          <OutreMerMapSVG
            regionName={om.nom}
            fillColor="var(--color-purple-oxfam-600)"
            clickable={true}
            className="md:size-24 h-9 w-24"
            iconType="none"
            onTerritoryClick={onRegionChange}
          />
        </div>
        <div className="flex-1 flex flex-row justify-center items-center gap-0.5">
          <h2 className="text-chiffre-xxs svg-bg svg-chiffres-outremers px-3.75 py-[1.5px] text-foundations-violet-principal">
            {percentage} %
          </h2>
          {isEvolutionPositive && <ArrowUpIcon className="w-7 h-7" />}
          {isEvolutionNegative && <ArrowDownIcon className="w-7 h-7" />}
        </div>
        <h2 className="flex-3 flex body2-medium items-start text-center text-foundations-violet-principal">
          {om.nom.toUpperCase()}
        </h2>
      </div>
    );
  });

  return <>{outreMerDivHtml}</>;
};

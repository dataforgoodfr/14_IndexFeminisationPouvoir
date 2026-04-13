import type {
  DataMapsProps,
  MapRegionSVGProps,
} from "@/components/FranceMapSVG";
import { ArrowDownIcon } from "@/components/icons/arrow-down";
import { ArrowUpIcon } from "@/components/icons/arrow-up";
import DataMapSVG from "@/data/maps_svg.json";
import { cn } from "@/lib/utils";
import { ClickablePath } from "./ClickableMap";

type OutreMerMapSVGProps = React.SVGProps<SVGSVGElement> & MapRegionSVGProps;

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
  ...props
}: OutreMerMapSVGProps) => {
  const data_maps_svg = DataMapSVG as DataMapsProps;

  const outreMerList = data_maps_svg["outre-mer"].map((item) => item.nom);

  if (!outreMerList.includes(regionName as string)) {
    console.log(regionName);
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

      return (
        <svg
          viewBox={viewBox}
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
      percentage: number;
      evolution: number;
    }
  >;
};

export const OutreMerGrid = ({ dataPerRegion }: OutreMerGridProps) => {
  const data_maps_svg = DataMapSVG as DataMapsProps;
  const OutreMerNameList = data_maps_svg["outre-mer"];

  const outreMerDivHtml = OutreMerNameList.map((om) => {
    const percentage = dataPerRegion?.[om.nom]?.percentage || 0;
    const evolution = dataPerRegion?.[om.nom]?.evolution || 0;
    const isEvolutionPositive = evolution > 0;
    const isEvolutionNegative = evolution < 0;
    return (
      <div key={om.nom} className="-gap-[6px]">
        <div className="w-[110px] h-[120px] overflow-hidden">
          <OutreMerMapSVG
            regionName={om.nom}
            fillColor="var(--color-purple-oxfam-600)"
            clickable={true}
            className="size-100"
            iconType="none"
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-2">
          <h2 className="text-chiffre-xxs bg-chiffres-outremers px-[15px] py-[1.5px] text-foundations-violet-principal">
            {percentage} %
          </h2>
          {isEvolutionPositive && <ArrowUpIcon />}
          {isEvolutionNegative && <ArrowDownIcon />}
        </div>
        <h2 className="body2-medium text-center text-foundations-violet-principal">
          {om.nom.toUpperCase()}
        </h2>
      </div>
    );
  });

  return <>{outreMerDivHtml}</>;
};

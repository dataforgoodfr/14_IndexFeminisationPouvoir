import type React from "react";
import DataMapSVG from "@/data/maps_svg.json";
import { cn } from "@/lib/utils";
import { ClickablePath } from "./ClickableMap";

export type TerritoryType = "regions" | "departements" | "outre-mer";

export type DataMapsProps = Record<
  TerritoryType,
  Array<{
    d: string;
    viewBox: string;
    "aria-label": string;
    nom: string;
    className?: string;
    textCoordinates?: { x: number; y: number };
  }>
>;

export type MapSVGProps = {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
};

export type MapRegionSVGProps = MapSVGProps & {
  regionName?: string;
  clickable?: boolean; // Whether the region is clickable
  text?: string; // Text to display on the region
  className?: string; // CSS class for the text
  textCoordinates?: { x: number; y: number }; // Coordinates for the text position
  iconType?: "up" | "down" | "none"; // Type of icon to display
};

export type MultipleRegionSVGProps = MapSVGProps & {
  dataPerRegion?: Record<
    string,
    {
      percentage: number;
      evolution: number;
    }
  >;
};

type FranceMapSVGProps = React.SVGProps<SVGSVGElement> & MultipleRegionSVGProps;

const FranceMapSVG = ({
  fillColor = "#513893",
  strokeColor = "white",
  strokeWidth = 2,
  width = 500,
  height = 500,
  dataPerRegion,
  ...props
}: FranceMapSVGProps) => {
  const data_maps_svg = DataMapSVG as DataMapsProps;
  const regionsList = data_maps_svg.regions;

  // From dataPerRegion, we generate textList, iconList and tooltipList with the same order as regionsList
  const textList = regionsList.map((region) => {
    const percentage = dataPerRegion
      ? dataPerRegion[region.nom]?.percentage
      : 0;
    return percentage ? `${percentage}%` : "";
  });

  const iconList = regionsList.map((region) => {
    const evolution = dataPerRegion ? dataPerRegion[region.nom]?.evolution : 0;
    return evolution > 0 ? "up" : evolution < 0 ? "down" : "none";
  });

  const tooltipList = regionsList.map((region) => {
    const percentage = dataPerRegion
      ? dataPerRegion[region.nom]?.percentage
      : 0;
    const evolution = dataPerRegion ? dataPerRegion[region.nom]?.evolution : 0;
    return `${region.nom}\n${percentage}%\nEvolution: ${evolution > 0 ? "+" : ""}${evolution}%`;
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 435 468"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Carte des Régions de la Metropole Française"
      role="img"
      {...props}
      className={cn("", props.className)}
    >
      {/* Construct all Region Path with map on DataRegionSVG */}

      {regionsList.map((region) => (
        <ClickablePath
          key={region.nom}
          ariaLabel={region.nom}
          d={region.d}
          fillColor={fillColor}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          text={textList[regionsList.indexOf(region)]}
          iconType={iconList[regionsList.indexOf(region)]}
          className={region.className || "body1-medium text-white"}
          textCoordinates={region.textCoordinates}
          tooltipText={tooltipList[regionsList.indexOf(region)]}
        />
      ))}
    </svg>
  );
};

export { FranceMapSVG };

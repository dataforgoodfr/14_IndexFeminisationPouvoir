import type React from "react";
import DataMapSVG from "@/data/maps_svg.json";
import { cn } from "@/lib/utils";
import { ClickablePath, calculateIconPosition } from "./ClickableMap";
import type { DataMapsProps, MultipleRegionSVGProps } from "./FranceMapSVG";
import { ArrowDownIcon } from "./icons/arrow-down";
import { ArrowUpIcon } from "./icons/arrow-up";

type RegionWithDeptMapSVGProps = React.SVGProps<SVGSVGElement> &
  MultipleRegionSVGProps & {
    zoneName: string;
    onDepartementClick?: (departementName: string) => void;
  };

const RegionWithDeptMapSVG = ({
  fillColor = "#513893",
  strokeColor = "white",
  strokeWidth = 1,
  width = 500,
  height = 500,
  zoneName,
  dataPerZone,
  onDepartementClick,
  ...props
}: RegionWithDeptMapSVGProps) => {
  const data_maps_svg = DataMapSVG as DataMapsProps;

  // Check if zoneName exists in data_maps_svg.regions or in data_maps_svg.outre-mer
  const regionExistsInMetropole = data_maps_svg.regions.some(
    (region) => region.nom === zoneName,
  );
  const regionExistsInOutreMer = data_maps_svg["outre-mer"].some(
    (om) => om.nom === zoneName,
  );

  if (!regionExistsInMetropole && !regionExistsInOutreMer) {
    // If the region is not found in both, we can return an empty svg or a message
    return (
      <svg
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Carte de la région ${zoneName} non trouvée`}
        role="img"
        {...props}
        className={cn("", props.className)}
      >
        <text x="50%" y="50%" textAnchor="middle" fill="black">
          Région non trouvée
        </text>
      </svg>
    );
  }

  // Get List of departements of the region with zoneName from data_maps_svg.departements
  let departementsListBase = data_maps_svg.departements;

  // Reduce departementsList to only keep departements of the region with regionName
  let departementsList = [];
  if (regionExistsInMetropole) {
    departementsList = departementsListBase.filter(
      (departement) =>
        departement.regionName ===
        data_maps_svg.regions.find((region) => region.nom === zoneName)?.nom,
    );
  } else {
    // If the region is in outre-mer, we just show the departement with the same name as the region
    departementsListBase = data_maps_svg["outre-mer"];

    departementsList = departementsListBase.filter(
      (departement) => departement.nom === zoneName,
    );
  }

  // Special departements that should display region name before percentage
  const specialDepartements = new Set(["Paris", "Hauts-de-Seine"]);

  // From dataPerZone, we generate textList, iconList and tooltipList with the same order as regionsList
  const textList = departementsList.map((departement) => {
    const percentage = dataPerZone
      ? dataPerZone[departement.nom]?.percentage
      : 0;
    if (percentage === undefined || percentage === null) return "";

    // For Paris, Hauts-de-Seine, Territoire de Belfort: show "regionName : XX %"
    if (specialDepartements.has(departement.nom)) {
      return `${departement.nom} : ${percentage} %`;
    }
    // For other departements: show "XX%"
    return `${percentage}%`;
  });

  const iconList = departementsList.map((departement) => {
    const evolution = dataPerZone ? dataPerZone[departement.nom]?.evolution : 0;
    return evolution > 0 ? "up" : evolution < 0 ? "down" : "none";
  });

  const tooltipList = departementsList.map((departement) => {
    const percentage = dataPerZone
      ? dataPerZone[departement.nom]?.percentage
      : 0;
    const evolution = dataPerZone ? dataPerZone[departement.nom]?.evolution : 0;
    return `${departement.nom}\n${percentage}%\nEvolution: ${evolution > 0 ? "+" : ""}${evolution}%`;
  });

  // Get viewBoxRegion from data_maps_svg.regions with zoneName
  const region_search_list = regionExistsInMetropole
    ? data_maps_svg.regions
    : data_maps_svg["outre-mer"];
  let viewBoxRegion = region_search_list.find(
    (item) => item.nom === zoneName,
  )?.viewBox;
  if (!viewBoxRegion) {
    viewBoxRegion = "0 0 500 500"; // default viewBox if not found
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBoxRegion}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Carte de la région ${zoneName}`}
      role="img"
      {...props}
      className={cn("", props.className)}
    >
      {/* Construct all Region Path with map on DataRegionSVG */}

      {departementsList.map((departement) => (
        <ClickablePath
          key={departement.nom}
          ariaLabel={departement.nom}
          d={departement.d}
          fillColor={fillColor}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          text={textList[departementsList.indexOf(departement)]}
          className={
            departement.className ||
            "font-lato font-normal text-[8px] text-white"
          }
          textCoordinates={departement.textCoordinates}
          tooltipText={tooltipList[departementsList.indexOf(departement)]}
          onTerritoryClick={
            regionExistsInMetropole ? onDepartementClick : undefined
          }
        />
      ))}

      {/* Render all icons on top layer */}
      {departementsList.map((departement) => {
        const iconType = iconList[departementsList.indexOf(departement)];
        if (iconType === "none") return null;

        const textCoordinates = departement.textCoordinates || { x: 0, y: 0 };
        const text = textList[departementsList.indexOf(departement)];
        const iconSize = departement.iconSize || 11;
        const iconPosition = calculateIconPosition(
          textCoordinates,
          text?.length || 0,
          iconSize,
        );

        return (
          <g
            key={`icon-${departement.nom}`}
            transform={`translate(${iconPosition.x}, ${iconPosition.y})`}
            pointerEvents="none"
          >
            {iconType === "up" ? (
              <ArrowUpIcon size={iconSize} />
            ) : (
              <ArrowDownIcon size={iconSize} />
            )}
          </g>
        );
      })}
    </svg>
  );
};

const DeptMapSVG = ({
  fillColor = "#513893",
  strokeColor = "white",
  strokeWidth = 1,
  width = 500,
  height = 500,
  zoneName,
  dataPerZone,
  onDepartementClick,
  ...props
}: RegionWithDeptMapSVGProps) => {
  const data_maps_svg = DataMapSVG as DataMapsProps;

  // Check if Departement exists in data_maps_svg.departements
  const deptExists = data_maps_svg.departements.some(
    (dept) => dept.nom === zoneName,
  );

  if (!deptExists) {
    // If the departement is not found, we can return an empty svg or a message
    return (
      <svg
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Carte de la région ${zoneName} non trouvée`}
        role="img"
        {...props}
        className={cn("", props.className)}
      >
        <text x="50%" y="50%" textAnchor="middle" fill="black">
          Région non trouvée
        </text>
      </svg>
    );
  }

  // Get departement with zoneName
  const departements_map_svg = data_maps_svg.departements.find(
    (departement) => departement.nom === zoneName,
  );

  // Get the region name of the selected departement
  const regionNameOfDept = departements_map_svg?.regionName;

  // Get all other departements in the same region except the selected one
  const otherDepartements = data_maps_svg.departements.filter(
    (departement) =>
      departement.regionName === regionNameOfDept &&
      departement.nom !== zoneName,
  );

  // From dataPerZone, we generate text, icon and tooltip for the found departement
  const text =
    dataPerZone && departements_map_svg
      ? `${dataPerZone[departements_map_svg.nom]?.percentage || 0}%`
      : "";

  const iconType =
    dataPerZone && departements_map_svg
      ? (dataPerZone[departements_map_svg.nom]?.evolution || 0) > 0
        ? "up"
        : (dataPerZone[departements_map_svg.nom]?.evolution || 0) < 0
          ? "down"
          : "none"
      : "none";

  const tooltip =
    dataPerZone && departements_map_svg
      ? `${departements_map_svg.nom}\n${dataPerZone[departements_map_svg.nom]?.percentage || 0}%\nEvolution: ${(dataPerZone[departements_map_svg.nom]?.evolution || 0) > 0 ? "+" : ""}${dataPerZone[departements_map_svg.nom]?.evolution || 0}%`
      : "";

  // TooltipList for other departements
  const tooltipList = otherDepartements.map((departement) => {
    const percentage = dataPerZone
      ? dataPerZone[departement.nom]?.percentage
      : 0;
    const evolution = dataPerZone ? dataPerZone[departement.nom]?.evolution : 0;
    return `${departement.nom}\n${percentage}%\nEvolution: ${evolution > 0 ? "+" : ""}${evolution}%`;
  });

  //   Get viewBox of the departement with zoneName
  let viewBoxDept = data_maps_svg.departements.find(
    (item) => item.nom === zoneName,
  )?.viewBox;
  if (!viewBoxDept) {
    viewBoxDept = "0 0 421 463"; // default viewBox if not found
  }

  // Get viewBox of the region of the departement to align all departements properly
  const viewBoxRegion = data_maps_svg.regions.find(
    (region) => region.nom === regionNameOfDept,
  )?.viewBox;

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBoxRegion}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Carte du département ${zoneName}`}
      role="img"
      {...props}
      className={cn("", props.className)}
    >
      {/* Render all other departements with reduced opacity and non-clickable */}
      {otherDepartements.map((departement) => (
        <ClickablePath
          key={departement?.nom}
          ariaLabel={departement?.nom}
          d={departement?.d}
          fillColor={fillColor}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          tooltipText={tooltipList[otherDepartements.indexOf(departement)]}
          fillOpacity={0.2}
          onTerritoryClick={onDepartementClick}
        />
      ))}

      <ClickablePath
        key={departements_map_svg?.nom}
        ariaLabel={departements_map_svg?.nom}
        d={departements_map_svg?.d}
        fillColor={fillColor}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        text={text}
        iconType={iconType}
        className={
          departements_map_svg?.className ||
          "font-lato font-normal text-[8px] text-white"
        }
        textCoordinates={departements_map_svg?.textCoordinates}
        tooltipText={tooltip}
        iconSize={departements_map_svg?.iconSize || 11}
        hideIcon={true}
        onTerritoryClick={onDepartementClick}
      />

      {/* Render icon on top layer */}
      {iconType !== "none" &&
        departements_map_svg?.textCoordinates &&
        (() => {
          const iconPosition = calculateIconPosition(
            departements_map_svg.textCoordinates,
            text?.length || 0,
            departements_map_svg?.iconSize || 11,
          );
          return (
            <g
              transform={`translate(${iconPosition.x}, ${iconPosition.y})`}
              pointerEvents="none"
            >
              {iconType === "up" ? (
                <ArrowUpIcon size={departements_map_svg?.iconSize || 11} />
              ) : (
                <ArrowDownIcon size={departements_map_svg?.iconSize || 11} />
              )}
            </g>
          );
        })()}
    </svg>
  );
};

export { RegionWithDeptMapSVG, DeptMapSVG };

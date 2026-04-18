// biome-ignore-all lint/a11y/useSemanticElements: region path element doit rester un path
"use client";
import type React from "react";
import { ArrowDownIcon } from "@/components/icons/arrow-down";
import { ArrowUpIcon } from "@/components/icons/arrow-up";

import type { MapSVGProps } from "./FranceMapSVG";

export const calculateIconPosition = (
  textCoordinates: { x: number; y: number },
  textLength: number,
  iconSize: number,
) => {
  const sizeRatio = iconSize / 25;
  return {
    x: textCoordinates.x + textLength * 6 * sizeRatio,
    y: textCoordinates.y - 15 * sizeRatio,
  };
};

export type ClickablePathProps = MapSVGProps & {
  ariaLabel?: string;
  d?: string; // Path data for the SVG region
  clickable?: boolean; // Whether the region is clickable
  text?: string; // Text to display on the region
  fillOpacity?: number;
  className?: string; // CSS class for the text
  textCoordinates?: { x: number; y: number }; // Coordinates for the text position
  iconType?: "up" | "down" | "none"; // Type of icon to display
  iconSize?: number;
  tooltipText?: string; // Text for the tooltip
  hideIcon?: boolean; // Skip rendering icon (will be rendered in separate layer)
  onTerritoryChange?: (territoryName: string) => void; // Callback when territory is clicked
};

export const ClickablePath: React.FC<ClickablePathProps> = ({
  d,
  ariaLabel,
  fillColor,
  strokeColor,
  strokeWidth,
  text,
  fillOpacity = 1,
  className = "",
  textCoordinates = { x: 0, y: 0 },
  iconType = "none",
  iconSize = 25,
  tooltipText = "",
  onTerritoryChange,
}) => {
  const textPosition = { x: textCoordinates.x, y: textCoordinates.y };
  const iconPosition = calculateIconPosition(
    textCoordinates,
    text?.length || 0,
    iconSize,
  );

  const handleMouseEnter = (
    e: React.MouseEvent<SVGPathElement, MouseEvent>,
  ) => {
    e.currentTarget.setAttribute("opacity", "0.7");
    e.currentTarget.setAttribute("cursor", "pointer");
  };

  const handleMouseLeave = (
    e: React.MouseEvent<SVGPathElement, MouseEvent>,
  ) => {
    e.currentTarget.setAttribute("opacity", "1");
    e.currentTarget.setAttribute("cursor", "default");
  };

  const handleClick = (e: React.MouseEvent<SVGPathElement, MouseEvent>) => {
    const territoryName = e.currentTarget.getAttribute("aria-label");
    if (territoryName && onTerritoryChange) {
      onTerritoryChange(territoryName);
    }
  };

  return (
    <>
      <g>
        <title>{tooltipText}</title>
        <path
          d={d}
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          aria-label={ariaLabel}
          role="button"
          onMouseEnter={(e) => handleMouseEnter(e)}
          onMouseLeave={(e) => {
            handleMouseLeave(e);
          }}
          onClick={(e) => {
            handleClick(e);
          }}
        />
      </g>
      {text && (
        <text
          x={textPosition.x}
          y={textPosition.y}
          fill="currentColor"
          className={className}
          textAnchor="middle"
          dominantBaseline="middle"
          pointerEvents="none"
        >
          {text}
        </text>
      )}

      {iconType === "up" && (
        <g
          transform={`translate(${iconPosition.x}, ${iconPosition.y})`}
          pointerEvents="none"
        >
          <ArrowUpIcon size={iconSize} />
        </g>
      )}
      {iconType === "down" && (
        <g
          transform={`translate(${iconPosition.x}, ${iconPosition.y})`}
          pointerEvents="none"
        >
          <ArrowDownIcon size={iconSize} />
        </g>
      )}

      {/* <ArrowUpIcon /> */}
    </>
  );
};

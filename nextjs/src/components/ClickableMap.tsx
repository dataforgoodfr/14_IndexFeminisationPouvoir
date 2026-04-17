// biome-ignore-all lint/a11y/useSemanticElements: region path element doit rester un path
"use client";
import type React from "react";
import { ArrowDownIcon } from "@/components/icons/arrow-down";
import { ArrowUpIcon } from "@/components/icons/arrow-up";

import type { MapSVGProps } from "./FranceMapSVG";

export type ClickablePathProps = MapSVGProps & {
  ariaLabel?: string;
  d?: string; // Path data for the SVG region
  clickable?: boolean; // Whether the region is clickable
  text?: string; // Text to display on the region
  className?: string; // CSS class for the text
  textCoordinates?: { x: number; y: number }; // Coordinates for the text position
  iconType?: "up" | "down" | "none"; // Type of icon to display
  tooltipText?: string; // Text for the tooltip
};

export const ClickablePath: React.FC<ClickablePathProps> = ({
  d,
  ariaLabel,
  fillColor,
  strokeColor,
  strokeWidth,
  text,
  className = "",
  textCoordinates = { x: 0, y: 0 },
  iconType = "down",
  tooltipText = "",
}) => {
  const textPosition = { x: textCoordinates.x, y: textCoordinates.y };
  const iconPosition = {
    x: textCoordinates.x + (text?.length || 0) * 6,
    y: textCoordinates.y - 15,
  }; // Position the icon to the right of the text

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
    console.log(
      `Clicked on region: ${e.currentTarget.getAttribute("aria-label")}`,
    );
    // Add your click logic here, e.g., navigate or update state
  };

  return (
    <>
      <g>
        <title>{tooltipText}</title>
        <path
          d={d}
          fill={fillColor}
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
          <ArrowUpIcon />
        </g>
      )}
      {iconType === "down" && (
        <g
          transform={`translate(${iconPosition.x}, ${iconPosition.y})`}
          pointerEvents="none"
        >
          <ArrowDownIcon />
        </g>
      )}

      {/* <ArrowUpIcon /> */}
    </>
  );
};

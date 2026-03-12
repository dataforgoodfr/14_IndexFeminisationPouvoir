"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

type ArcDiagramPctProps = {
  value: number;
  radius: number;
  description?: string;
  fontSize?: number;
  arcColor?: string;
  valueColor?: string;
  descriptionColor?: string;
  maxDegree?: number;
};

export const ArcDiagramPct = ({
  value,
  radius,
  description,
  fontSize,
  arcColor,
  valueColor,
  descriptionColor,
  maxDegree,
}: ArcDiagramPctProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 150, height: 0 });

  const baseArcColor = "#e6e6e6";
  const tresholdColor = value >= 50 ? "green" : "red";
  // Set default colors if not provided
  arcColor = arcColor ? arcColor : tresholdColor;
  valueColor = valueColor ? valueColor : tresholdColor;
  descriptionColor = descriptionColor ? descriptionColor : "black";

  // Set maxDegree if not provided
  const maxDegreeValue =
    maxDegree && maxDegree > 0 && maxDegree < 360 ? maxDegree : 220;

  // Calculate the degree for the given value (0-100%)
  const degree = (value / 100) * maxDegreeValue;

  // Calculate minimal Height and Width needed for the arc
  const margin_radius = 10;
  const margin_top_and_bottom = 10;
  const margin_sides = 10;

  const arcHeight = (radius + margin_radius) * 2 + margin_top_and_bottom;
  const arcWidth = (radius + margin_radius) * 2 + margin_sides;

  useEffect(() => {
    if (containerRef.current) {
      const parentWidth =
        containerRef.current.parentElement?.offsetWidth || 150;
      const parentHeight =
        containerRef.current.parentElement?.offsetHeight || 150;
      setDimensions({
        width: Math.max(parentWidth, arcWidth),
        height: Math.max(parentHeight, arcHeight),
      });
    }
  }, [arcHeight, arcWidth]);

  // Arc diagram Position
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  const degreeToRadian = (degree: number) => (degree * Math.PI) / 180;

  // Complete Arc (background)
  const arcGenerator = d3.arc().cornerRadius(30);
  const arcPath = arcGenerator({
    startAngle: degreeToRadian(-maxDegreeValue / 2),
    endAngle: degreeToRadian(maxDegreeValue / 2),
    innerRadius: radius + 1,
    outerRadius: radius + 15,
  });
  // Value Arc (foreground)
  const arcPath2 = arcGenerator({
    startAngle: degreeToRadian(-maxDegreeValue / 2),
    endAngle: degreeToRadian(-maxDegreeValue / 2 + degree),
    innerRadius: radius + 1,
    outerRadius: radius + 15,
  });

  // Decription Text and position
  const descriptionText = description ? description : "";
  const descriptionPositionX = 0;
  const descriptionPositionY = -radius * 0.15;

  // Value Text and position
  const valueText = `${value}%`;
  const valuePositionX = 0;
  const valuePositionY = radius * 0.6;

  // Font sizes
  const descriptionFontSize = fontSize ? fontSize : (3 / 20) * radius + 8;
  const valueFontSize = fontSize ? fontSize : (3 / 20) * radius + 10;

  // Function to calculate max chars per line based on font size
  const getMaxCharsPerLine = (fontSize: number): number => {
    // Base calculation: at fontSize 16, we want roughly 7 chars for a radius of 40
    const basefontSize = 16;
    const baseCharsPerLine = (7 / 40) * radius; // Empirically determined ratio of chars to radius
    return Math.floor(baseCharsPerLine * (basefontSize / fontSize));
  };

  // Function to wrap text to fit inside the arc circle
  const wrapTextForArc = (text: string, fontSize: number): string[] => {
    if (!text) return [];
    const maxCharsPerLine = getMaxCharsPerLine(fontSize);
    const words = text.split(" ");
    const lines: string[] = [];

    let currentLine = "";

    for (const w of words) {
      if ((currentLine + w).length <= maxCharsPerLine) {
        currentLine += (currentLine !== "" ? " " : "") + w;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = w;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  const descriptionLines = wrapTextForArc(descriptionText, descriptionFontSize);
  const lineHeight = descriptionFontSize + 2;

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full font-sans"
    >
      <svg width={dimensions.width} height={dimensions.height}>
        <title>{`${descriptionText}·${valueText}`}</title>
        <g transform={`translate(${centerX}, ${centerY})`}>
          <path d={arcPath || ""} fill={baseArcColor} />
          <path d={arcPath2 || ""} fill={arcColor} />
          <text
            x={descriptionPositionX}
            y={
              descriptionPositionY -
              (descriptionLines.length - 1) * (lineHeight / 2)
            }
            textAnchor="middle"
            fontSize={descriptionFontSize}
            fill={descriptionColor}
          >
            {descriptionLines.map((line, idx) => (
              <tspan
                key={`${idx}-${line}`}
                x={descriptionPositionX}
                dy={idx === 0 ? 0 : lineHeight}
              >
                {line}
              </tspan>
            ))}
          </text>

          <text
            x={valuePositionX}
            y={valuePositionY}
            textAnchor="middle"
            fontSize={valueFontSize}
            fontWeight="bold"
            fill={valueColor}
          >
            {valueText}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default ArcDiagramPct;

'use client'

import * as d3 from "d3";
import { useRef, useEffect, useState } from 'react'

type ArcDiagramPctProps = {
    value: number;
    radius: number;
    description?: string;
    fontSize?:number;
    arcColor?: string;
    valueColor?: string;
    descriptionColor?: string;
};

export const ArcDiagramPct = ({value, radius , description , fontSize, arcColor , valueColor, descriptionColor }: ArcDiagramPctProps) => {

    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 150, height: 0 })

    const baseArcColor = "#e6e6e6"
    const tresholdColor = value >= 50 ? "green" : "red"
    // Set default colors if not provided
    arcColor = arcColor ? arcColor : tresholdColor
    valueColor = valueColor ? valueColor : tresholdColor
    descriptionColor = descriptionColor ? descriptionColor : "black"

    // Calculate the degree for the given value (0-100%)
    const maxDegree = 280
    const degree = (value / 100) * maxDegree
    
    // Calculate minimal Height and Width needed for the arc
    const margin_radius = 10
    const margin_top_and_bottom = 10
    const margin_sides = 10

    const arcHeight = (radius + margin_radius) * 2 + margin_top_and_bottom
    const arcWidth = (radius + margin_radius) * 2 + margin_sides

    useEffect(() => {
    if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.offsetWidth || 150
        const parentHeight = containerRef.current.parentElement?.offsetHeight || 150
        setDimensions({
        width: Math.max(parentWidth, arcWidth),
        height: Math.max(parentHeight, arcHeight),
        })
    }
    }, [arcHeight, arcWidth])

    // Arc diagram Position
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Complete Arc (background)
    const baseArcGenerator = d3.arc()
        .innerRadius(radius+1)
        .outerRadius(radius + 15)
        .startAngle((-maxDegree/2) * Math.PI/180)
        .endAngle((maxDegree/2) * Math.PI/180) // Convert degree to radians
        .cornerRadius(30);
    const arcPath = baseArcGenerator({} as any);

    // Value Arc (foreground)
    const arcGenerator2 = d3.arc()
        .innerRadius(radius+1)
        .outerRadius(radius + 15)
        .startAngle((-maxDegree/2) * Math.PI/180)
        .endAngle((-maxDegree/2 + degree) * Math.PI/180) // Convert degree to radians
        .cornerRadius(30);
    const arcPath2 = arcGenerator2({} as any);

    
    // Decription Text and position
    const descriptionText = description ? description : ""
    const descriptionPositionX = 0
    const descriptionPositionY = -radius * 0.15

    // Value Text and position
    const valueText = `${value}%`
    const valuePositionX = 0
    const valuePositionY = -(radius * Math.sin(maxDegree*Math.PI/180)) * 0.75

    // Font sizes
    const descriptionFontSize = fontSize ? fontSize : (3/20)*radius + 8
    const valueFontSize = fontSize ? fontSize : (3/20)*radius + 10

    // Function to calculate max chars per line based on font size
    const getMaxCharsPerLine = (fontSize: number): number => {
        // Base calculation: at fontSize 16, we want roughly 7 chars for a radius of 40
        const basefontSize = 16
        const baseCharsPerLine = 7/40 * (radius) // Empirically determined ratio of chars to radius
        return Math.floor(baseCharsPerLine * (basefontSize / fontSize))
    }

    // Function to wrap text to fit inside the arc circle
    const wrapTextForArc = (text: string, fontSize: number): string[] => {
        if (!text) return []
        const maxCharsPerLine = getMaxCharsPerLine(fontSize)
        const words = text.split(' ')
        const lines: string[] = []

        let currentLine = ''

        for (const w of words) {
            if ((currentLine + w).length <= maxCharsPerLine) {
                currentLine += (currentLine!='' ? ' ' : '') + w
            } else {
                if (currentLine){
                    lines.push(currentLine)
                }
                currentLine = w
            }
        }
        
        if (currentLine){
            lines.push(currentLine)
        } 
        return lines
    }

    const descriptionLines = wrapTextForArc(descriptionText, descriptionFontSize)
    const lineHeight = descriptionFontSize + 2
    
    return (
        <div 
        ref={containerRef}
        className="flex items-center justify-center w-full font-sans"
        >
        <svg width={dimensions.width} height={dimensions.height}>
            <g transform={`translate(${centerX}, ${centerY})`}>
                <path d={arcPath || ""} fill={baseArcColor} />
                <path d={arcPath2 || ""} fill={arcColor} />
                <text 
                x={descriptionPositionX} 
                y={descriptionPositionY - (descriptionLines.length - 1) * (lineHeight / 2)} 
                textAnchor="middle"
                fontSize={descriptionFontSize}
                fill={descriptionColor}
                >
                    {descriptionLines.map((line, idx) => (
                        <tspan key={idx} x={descriptionPositionX} dy={idx === 0 ? 0 : lineHeight}>
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

export default ArcDiagramPct
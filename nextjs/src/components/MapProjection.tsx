"use client";

import * as d3 from "d3";
import type * as GeoJSON from "geojson";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Load GeoJSON map data from a file path
 * GeoJSON is a format that contains geographic shapes (regions/countries)
 */
async function fetchGeoData(
  pathData: string,
): Promise<GeoJSON.FeatureCollection | GeoJSON.Feature> {
  if (!pathData) return { type: "FeatureCollection", features: [] };
  const response = await fetch(pathData);
  const dataGeoJson = await response.json();
  return dataGeoJson;
}

/**
 * Load region data containing percentages for each region
 * Expected format: { regions: [{ nom: "Region Name", percentage: 50 }, ...] }
 */
async function fetchRegionData(
  pathData?: string,
): Promise<Record<string, number>> {
  if (!pathData) return {};
  const response = await fetch(pathData);
  const dataRegion = await response.json();

  const regionMap: Record<string, number> = {};

  // Convert the regions array into a map: { "region name": percentage, ... }
  if (dataRegion.regions && Array.isArray(dataRegion.regions)) {
    dataRegion.regions.forEach(
      (region: { nom: string; percentage: number }) => {
        regionMap[region.nom] = region.percentage;
      },
    );
  }

  // Convert the departments array into a map: { "region name": percentage, ... }
  if (dataRegion.departements && Array.isArray(dataRegion.departements)) {
    dataRegion.departements.forEach(
      (department: { nom: string; percentage: number }) => {
        regionMap[department.nom] = department.percentage;
      },
    );
  }

  return regionMap;
}

// ==================== COMPONENT ====================

type MapProjectionProps = {
  pathGeoJson: string; // Path to GeoJSON file (map shapes)
  title?: string; // Optional title
  mapRatio: number; // Height/width ratio
  pathData?: string; // Path to region data file
  projectionMethod?: any; // D3 projection method to use (default is geoIdentity)
  onRegionClick?: (
    feature: GeoJSON.Feature,
    percentage: number | string,
  ) => void; // Callback when region is clicked
  colorGradientList?: string[]; // Optional list of colors for gradient
  selectedRegion?: string; // Name of the selected region
};

export default function MapProjection({
  pathGeoJson,
  title,
  mapRatio,
  pathData,
  projectionMethod,
  onRegionClick,
  colorGradientList = ["#F44336", "#FFC107", "#4CAF50", "#4CAF50"],
  selectedRegion = undefined,
}: MapProjectionProps) {
  // Store the map reference to draw on
  const mapRef = useRef<HTMLDivElement>(null);

  // States for loading, error handling
  const [geoData, setGeoData] = useState<
    GeoJSON.FeatureCollection | GeoJSON.Feature | null
  >(null);
  const [regionData, setRegionData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ==================== DATA LOADING ====================

  // load data function to fetch both GeoJSON and region data
  const loadData = useCallback(async () => {
    try {
      // Set loading state and clear previous errors
      setLoading(true);
      setError(null);

      // Fetch both datasets
      const geoJsonData = await fetchGeoData(pathGeoJson);
      const regionsData = await fetchRegionData(pathData);

      // Store in state
      setGeoData(geoJsonData);
      setRegionData(regionsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      // When it's done (either success or error), stop loading
      setLoading(false);
    }
  }, [pathGeoJson, pathData]);

  // Load data when component mounts or paths change
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * DrawMap function
   */
  const drawMap = useCallback(() => {
    /**
     * Get Percentage from a GeoJson.Feature and regionData.current ref
     * @param feature GeoJSON.Feature that we want the percentage from
     * @returns percentage or "N/A" if percentage not defined
     */
    const getPercentage = (feature: GeoJSON.Feature): number | string => {
      const regionName = (feature.properties as GeoJSON.GeoJsonProperties)?.nom;
      const percentage =
        regionData[regionName] !== undefined ? regionData[regionName] : "N/A";
      return percentage;
    };

    /**
     * Get Color for the region Background defined by percentage (retrieved with getPercentage function)
     * @param feature GeoJSON.Feature that we want to color
     * @returns color of the svg
     */
    const getColor = (feature: GeoJSON.Feature): string => {
      const percentage = getPercentage(feature);
      if (percentage !== "N/A") {
        // Use D3 scale to map percentage to color
        const colorScale = d3
          .scaleLinear<string>()
          .domain([0, 25, 50, 100])
          .range(colorGradientList);
        return colorScale(percentage as number);
      }
      return "#CCCCCC"; // Default gray if no data
    };

    const getOpacity = (feature: GeoJSON.Feature): string => {
      const regionName = (feature.properties as GeoJSON.GeoJsonProperties)?.nom;
      if (selectedRegion && regionName === selectedRegion) {
        return "1"; // Highlight selected region
      }
      return "0.8"; // Default opacity for other regions
    };

    // Check if geoData
    if (!geoData || !mapRef.current || loading) return;

    // Clear previous SVG
    d3.select(mapRef.current).selectAll("svg").remove();

    // ==================== SETUP ====================

    // Get map dimensions
    const mapWidth = mapRef.current.offsetWidth;
    const mapHeight = mapWidth * mapRatio; // Calculate height based on ratio

    // Create SVG container
    const svg = d3
      .select(mapRef.current)
      .append("svg")
      .style("display", "block")
      .style("width", "100%")
      .style("height", "auto")
      .style("border", "1px solid grey")
      .style("border-radius", "4px")
      .attr("viewBox", `0 0 ${mapWidth} ${mapHeight}`);

    // ==================== PROJECTION ====================

    let projection: any = projectionMethod();

    // Apply special settings for geoIdentity projection
    if (projectionMethod === d3.geoIdentity) {
      projection = projection.reflectY(true);
    }

    // Extract features from GeoJSON
    const features =
      geoData.type === "FeatureCollection" ? geoData.features : [geoData];

    // Fit the projection to show all features
    projection = projection.fitSize([mapWidth, mapHeight], {
      type: "FeatureCollection",
      features,
    });

    // Create path generator (converts geographic coords to SVG paths)
    const pathGenerator = d3.geoPath().projection(projection);

    // Create main container group
    const g = svg.append("g").attr("width", mapWidth).attr("height", mapHeight);

    // ==================== DRAW REGIONS ====================

    // Bind data to paths and draw them
    g.append("g")
      .attr("id", "states")
      .selectAll("path")
      .data(features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("fill", (feature: GeoJSON.Feature) => getColor(feature))
      .attr("opacity", (feature: GeoJSON.Feature) => getOpacity(feature))
      .attr("stroke", "white")
      .attr("stroke-width", "0.4px")
      .style("cursor", "pointer")

      // Hover effects
      .on("mouseenter", function (event, feature: GeoJSON.Feature) {
        d3.select(this).style("opacity", "0.6").style("stroke-width", "0.8px");

        // Show tooltip
        const regionName = (feature.properties as GeoJSON.GeoJsonProperties)
          ?.nom;
        const percentage = getPercentage(feature);

        d3.select(mapRef.current)
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px 12px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`)
          .text(`${regionName}: ${percentage}%`);
      })
      .on("mouseleave", function () {
        d3.select(this)
          .style("opacity", (feature) => getOpacity(feature as GeoJSON.Feature))
          .style("stroke-width", "0.4px");
        d3.selectAll(".tooltip").remove();
      })
      .on("click", (_event, feature: GeoJSON.Feature) => {
        // Call the callback when a region is clicked
        if (onRegionClick) {
          const percentage = getPercentage(feature);
          onRegionClick(feature, percentage);
        }
      });

    // Add percentage text labels on regions
    g.append("g")
      .attr("id", "labels")
      .selectAll("text")
      .data(features)
      .enter()
      .append("text")
      .attr(
        "x",
        (feature: GeoJSON.Feature) => pathGenerator.centroid(feature)[0],
      )
      .attr(
        "y",
        (feature: GeoJSON.Feature) => pathGenerator.centroid(feature)[1],
      )
      .attr("text-anchor", "middle")
      .style("font-size", `${mapWidth * 0.025}px`)
      .style("font-weight", "bold")
      .style("pointer-events", "none") // To avoid cursor transformation
      .text((feature: GeoJSON.Feature) => `${getPercentage(feature)}%`);
  }, [
    geoData,
    regionData,
    loading,
    mapRatio,
    projectionMethod,
    onRegionClick,
    colorGradientList,
    selectedRegion,
  ]);

  useEffect(() => {
    drawMap();
  }, [drawMap]);

  // Show loading message while fetching data
  let loadingHtml = null;
  if (loading) {
    loadingHtml = <p className="text-center">Loading MAP...</p>;
  }

  // Show error message if there's an error
  let errorHtml = null;
  if (error) {
    errorHtml = (
      <p className="text-center"> Error loading map: {error.message} </p>
    );
  }

  // Show title if provided
  let titleHtml = null;
  if (title) {
    titleHtml = <h3 className="text-center">{title}</h3>;
  }

  return (
    <div>
      {titleHtml}
      {errorHtml}
      {loadingHtml}

      {/* Container where the map will be */}
      <div className="w-full" ref={mapRef} />
    </div>
  );
}

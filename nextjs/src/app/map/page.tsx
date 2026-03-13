"use client";

import * as d3 from "d3";
import type * as GeoJSON from "geojson";
import { useState } from "react";
import MapProjection from "../../components/MapProjection";

// Main maps to display: metropole and outre-mer regions
const metropoleMaps = [
  {
    pathGeoJson: "/data/geojson/regions/regions-metropole.geojson",
    title: "Métropole",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
  },
];
const outreMerMaps = [
  // {
  //   pathGeoJson: "/data/geojson/regions/971-region-guadeloupe.geojson",
  //   title: "Guadeloupe",
  //   mapRatio: 0.7,
  //   pathData: "/data/regions_data.json",
  //   projectionMethod: d3.geoMercator,
  // },
  // {
  //   pathGeoJson: "/data/geojson/regions/972-region-martinique.geojson",
  //   title: "Martinique",
  //   mapRatio: 0.7,
  //   pathData: "/data/regions_data.json",
  //   projectionMethod: d3.geoMercator,
  // },
  // {
  //   pathGeoJson: "/data/geojson/regions/973-region-guyane.geojson",
  //   title: "Guyane",
  //   mapRatio: 0.7,
  //   pathData: "/data/regions_data.json",
  //   projectionMethod: d3.geoMercator,
  // },
  // {
  //   pathGeoJson: "/data/geojson/regions/974-region-la-reunion.geojson",
  //   title: "La Réunion",
  //   mapRatio: 0.7,
  //   pathData: "/data/regions_data.json",
  //   projectionMethod: d3.geoMercator,
  // },
  // {
  //   pathGeoJson: "/data/geojson/regions/976-region-mayotte.geojson",
  //   title: "Mayotte",
  //   mapRatio: 0.7,
  //   pathData: "/data/regions_data.json",
  //   projectionMethod: d3.geoMercator,
  // },
  {
    pathGeoJson:
      "/data/geojson/regions/975-region-st-pierre-et-miquelon.geojson",
    title: "Saint-Pierre-et-Miquelon",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoIdentity,
  },
  // {
  //   pathGeoJson: "/data/geojson/regions/987-region-polynesie-fr-papete.geojson",
  //   title: "Polynésie Française",
  //   mapRatio: 0.7,
  //   pathData: "/data/regions_data.json",
  //   projectionMethod: d3.geoIdentity,
  // },
  // {
  //   pathGeoJson: "/data/geojson/regions/988-region-nouvelle-caledonie.geojson",
  //   title: "Kanaky - Nouvelle-Calédonie",
  //   mapRatio: 0.7,
  //   pathData: "/data/regions_data.json",
  //   projectionMethod: d3.geoMercator,
  // },
];

// ==================== COMPONENT ====================

export default function MapPage() {
  // State for selected region data
  const [selectedRegion, setSelectedRegion] = useState<{
    name: string;
    percentage: number | string;
    code_region?: string;
  } | null>(null);

  // Handle region click event
  const handleRegionClick = (
    feature: GeoJSON.Feature,
    percentage: number | string,
  ) => {
    setSelectedRegion({
      name:
        (feature.properties as GeoJSON.GeoJsonProperties)?.nom ||
        "Region inconnue",
      percentage: percentage,
      code_region:
        (feature.properties as GeoJSON.GeoJsonProperties)?.code ||
        "Code Region inconnu",
    });
  };

  // Generate MapProjection content for each region
  const metropoleProjectionsList = [];
  for (const map of metropoleMaps) {
    metropoleProjectionsList.push(
      <MapProjection
        key={map.title}
        pathGeoJson={map.pathGeoJson}
        title={map.title}
        mapRatio={map.mapRatio}
        pathData={map.pathData}
        projectionMethod={map.projectionMethod}
        onRegionClick={handleRegionClick}
      />,
    );
  }

  const outreMerProjectionsList = [];
  for (const map of outreMerMaps) {
    outreMerProjectionsList.push(
      <MapProjection
        key={map.title}
        pathGeoJson={map.pathGeoJson}
        title={map.title}
        mapRatio={map.mapRatio}
        pathData={map.pathData}
        projectionMethod={map.projectionMethod}
        onRegionClick={handleRegionClick}
      />,
    );
  }

  // Generate Info for selected region when a region is clicked on the map
  let selectedRegionHtml = null;
  if (selectedRegion) {
    selectedRegionHtml = (
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-center">{selectedRegion.name}</h2>
        <p className="text-center">Pourcentage: {selectedRegion.percentage}%</p>
        <p className="text-center">Code Région: {selectedRegion.code_region}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row ml-8 mr-8">
      {/* Left Side */}
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-8">{metropoleProjectionsList}</div>
        <div className="grid grid-cols-2 gap-8">{outreMerProjectionsList}</div>
      </div>
      {/* Right Side */}
      <div className="flex-1">{selectedRegionHtml}</div>
    </div>
  );
}

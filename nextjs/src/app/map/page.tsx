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

const departmentsMaps = [
  {
    pathGeoJson:
      "/data/geojson/departements/11-departement-ile-de-france.geojson",
    title: "Ile-de-France",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "11",
  },
  {
    pathGeoJson:
      "/data/geojson/departements/24-departement-centre-val-de-loire.geojson",
    title: "Centre-Val de Loire",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "24",
  },
  {
    pathGeoJson:
      "/data/geojson/departements/27-departement-bourgogne-franche-comte.geojson",
    title: "Bourgogne-Franche-Comté",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "27",
  },
  {
    pathGeoJson: "/data/geojson/departements/28-departement-normandie.geojson",
    title: "Normandie",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "28",
  },
  {
    pathGeoJson:
      "/data/geojson/departements/32-departement-hauts-de-france.geojson",
    title: "Hauts-de-France",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "32",
  },
  {
    pathGeoJson: "/data/geojson/departements/44-departement-grand-est.geojson",
    title: "Grand Est",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "44",
  },
  {
    pathGeoJson:
      "/data/geojson/departements/52-departement-pays-de-la-loire.geojson",
    title: "Pays de la Loire",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "52",
  },
  {
    pathGeoJson: "/data/geojson/departements/53-departement-bretagne.geojson",
    title: "Bretagne",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "53",
  },
  {
    pathGeoJson:
      "/data/geojson/departements/75-departement-nouvelle-aquitaine.geojson",
    title: "Nouvelle-Aquitaine",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "75",
  },
  {
    pathGeoJson: "/data/geojson/departements/76-departement-occitanie.geojson",
    title: "Occitanie",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "76",
  },
  {
    pathGeoJson:
      "/data/geojson/departements/84-departement-auvergne-rhone-alpes.geojson",
    title: "Auvergne-Rhône-Alpes",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "84",
  },
  {
    pathGeoJson:
      "/data/geojson/departements/93-departement-provence-alpes-cote-d-azur.geojson",
    title: "Provence-Alpes-Côte d'Azur",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "93",
  },
  {
    pathGeoJson: "/data/geojson/departements/94-departement-corse.geojson",
    title: "Corse",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
    code: "94",
  },
];

const outreMerMaps = [
  {
    pathGeoJson: "/data/geojson/regions/971-region-guadeloupe.geojson",
    title: "Guadeloupe",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
  },
  {
    pathGeoJson: "/data/geojson/regions/972-region-martinique.geojson",
    title: "Martinique",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
  },
  {
    pathGeoJson: "/data/geojson/regions/973-region-guyane.geojson",
    title: "Guyane",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
  },
  {
    pathGeoJson: "/data/geojson/regions/974-region-la-reunion.geojson",
    title: "La Réunion",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
  },
  {
    pathGeoJson: "/data/geojson/regions/976-region-mayotte.geojson",
    title: "Mayotte",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
  },
  {
    pathGeoJson:
      "/data/geojson/regions/975-region-st-pierre-et-miquelon.geojson",
    title: "Saint-Pierre-et-Miquelon",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoIdentity,
  },
  {
    pathGeoJson: "/data/geojson/regions/987-region-polynesie-fr-papete.geojson",
    title: "Polynésie Française",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoIdentity,
  },
  {
    pathGeoJson: "/data/geojson/regions/988-region-nouvelle-caledonie.geojson",
    title: "Kanaky - Nouvelle-Calédonie",
    mapRatio: 0.7,
    pathData: "/data/regions_data.json",
    projectionMethod: d3.geoMercator,
  },
];

// ==================== COMPONENT ====================

export default function MapPage() {
  const colorGradientListMap = ["#e9ecf7", "#513893", "#1e0f3c", "#1e0f3c"];

  // State for selected region data
  const [selectedRegion, setSelectedRegion] = useState<{
    name: string;
    percentage: number | string;
    code_region?: string;
  } | null>(null);

  // State for selected department data (when a region is clicked, we can also display the department map if it exists)
  const [selectedDepartment, setSelectedDepartment] = useState<{
    name: string;
    percentage: number | string;
    code_department?: string;
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
    //Reset selected department when a new region is clicked
    setSelectedDepartment(null);
  };

  // Handle department click event (when a region is clicked, we can also display the department map if it exists)
  const handleDepartmentClick = (
    feature: GeoJSON.Feature,
    percentage: number | string,
  ) => {
    setSelectedDepartment({
      name:
        (feature.properties as GeoJSON.GeoJsonProperties)?.nom ||
        "Département inconnu",
      percentage: percentage,
      code_department:
        (feature.properties as GeoJSON.GeoJsonProperties)?.code ||
        "Code Département inconnu",
    });
  };

  const addMetropoleToList = () => {
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
          colorGradientList={colorGradientListMap}
        />,
      );
    }
  };

  // Generate MapProjection content for each region
  const metropoleProjectionsList = [];
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
        colorGradientList={colorGradientListMap}
      />,
    );
  }

  // Generate Info for selected region when a region is clicked on the map
  let selectedRegionHtml = null;
  if (selectedRegion) {
    // Get map of the selected region's department if it exists
    const departmentMap = departmentsMaps.find(
      (deptMap) => deptMap.code === selectedRegion.code_region,
    );
    // If a map for the selected region's department exists, add it as a sub-map to the metropole map
    if (departmentMap) {
      metropoleProjectionsList.push(
        <MapProjection
          key={departmentMap.title}
          pathGeoJson={departmentMap.pathGeoJson}
          title={departmentMap.title}
          mapRatio={departmentMap.mapRatio}
          pathData={departmentMap.pathData}
          projectionMethod={departmentMap.projectionMethod}
          onRegionClick={handleDepartmentClick}
          selectedRegion={selectedDepartment ? selectedDepartment.name : ""}
          colorGradientList={colorGradientListMap}
        />,
      );
    } else {
      addMetropoleToList();
    }

    selectedRegionHtml = (
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-center">{selectedRegion.name}</h2>
        <p className="text-center">Pourcentage: {selectedRegion.percentage}%</p>
        <p className="text-center">Code Région: {selectedRegion.code_region}</p>
      </div>
    );
  } else {
    addMetropoleToList();
  }

  // Generate Info for selected department when a department is clicked on the map
  let selectedDepartmentHtml = null;
  if (selectedDepartment) {
    selectedDepartmentHtml = (
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-center">
          {selectedDepartment.name}
        </h2>
        <p className="text-center">
          Pourcentage: {selectedDepartment.percentage}%
        </p>
        <p className="text-center">
          Code Département: {selectedDepartment.code_department}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-row m-8">
      {/* Left Side */}
      <div className="flex-1">
        <div>
          <button
            className="mb-4 px-4 py-2 bg-purple-oxfam-600 text-neutral-0 rounded hover:bg-purple-oxfam-800 cursor-pointer"
            onClick={() => {
              setSelectedRegion(null);
              setSelectedDepartment(null);
            }}
            type="button"
          >
            Reset Selection
          </button>
          <div className="grid grid-cols-1 gap-8">
            {metropoleProjectionsList}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">{outreMerProjectionsList}</div>
      </div>
      {/* Right Side */}
      <div className="flex-1">
        {selectedRegionHtml} {selectedDepartmentHtml}
      </div>
    </div>
  );
}

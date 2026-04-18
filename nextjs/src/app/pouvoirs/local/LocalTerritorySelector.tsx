"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BlocClassement } from "@/components/BlocClassement";
import type { TerritoryType } from "@/components/FranceMapSVG";
import { FranceMapSVG } from "@/components/FranceMapSVG";
import { DownloadIcon } from "@/components/icons/download";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { OutreMerGrid } from "@/components/OutreMerMap";
import { RegionsSlider } from "@/components/RegionsSlider";
import { Tooltip } from "@/components/Tooltip";
import dataPouvoirLocal from "@/data/pouvoir_local.json";
import regionsDescriptions from "@/data/regions-descriptions.json";
import { createZoneDataMap } from "./page";
import { TerritoryView } from "./TerritoryView";

export type zoneData = Array<{
  code: string;
  nom: string;
  code_region?: string;
  percentage: number;
  evolution: number;
}>;

export type DataPouvoirLocal = Record<TerritoryType, zoneData>;

export function LocalTerritorySelector() {
  const [selectedRegion, setSelectedRegion] =
    useState<string>("Toutes les régions");
  const [selectedDepartement, setSelectedDepartement] = useState<string>(
    "Tous les départements",
  );

  const data_pouvoir_local = dataPouvoirLocal as DataPouvoirLocal;

  const dataPerDepartement = createZoneDataMap(data_pouvoir_local.departements);
  const dataPerRegionMetropole = createZoneDataMap(data_pouvoir_local.regions);
  const dataPerOutreMer = createZoneDataMap(data_pouvoir_local["outre-mer"]);
  const allDataPerZone = {
    ...dataPerRegionMetropole,
    ...dataPerOutreMer,
    ...dataPerDepartement,
  };

  // All regions combined
  const allRegions = [
    { nom: "Toutes les régions", code: "" },
    ...data_pouvoir_local.regions,
    ...data_pouvoir_local["outre-mer"],
  ];

  // Filtered departements based on selected region
  const filteredDepartements = useMemo(() => {
    if (selectedRegion === "Toutes les régions") {
      return [
        { nom: "Tous les départements", code: "" },
        ...data_pouvoir_local.departements,
      ];
    }
    // Check if selected region is an outre-mer
    const regionIsOutreMer = data_pouvoir_local["outre-mer"].some(
      (r) => r.nom === selectedRegion,
    );

    if (regionIsOutreMer) {
      // If it's an outre-mer, we don't have departement-level data, so return only "Tous les départements"
      return [{ nom: "Tous les départements", code: "" }];
    }

    // Find the region code
    const regionObj = data_pouvoir_local.regions.find(
      (r) => r.nom === selectedRegion,
    );
    if (!regionObj) return [{ nom: "Tous les départements", code: "" }];

    // Filter departements by region code
    const filtered = data_pouvoir_local.departements.filter(
      (d) => d.code_region === regionObj.code,
    );
    return [{ nom: "Tous les départements", code: "" }, ...filtered];
  }, [selectedRegion]);

  // Handle region click from map
  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    setSelectedDepartement("Tous les départements");
  };

  // Handle region change from select component
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleRegionClick(e.target.value);
  };

  // Handle departement click from map
  const handleDepartementClick = (departementName: string) => {
    setSelectedDepartement(departementName);
  };

  // Handle departement change from select component
  const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartement(e.target.value);
  };

  // Determine what to display
  const isAllSelected =
    selectedRegion === "Toutes les régions" &&
    selectedDepartement === "Tous les départements";
  const isRegionSelected =
    selectedRegion !== "Toutes les régions" &&
    selectedDepartement === "Tous les départements";
  const isDepartementSelected = selectedDepartement !== "Tous les départements";

  return (
    <div className="flex flex-col w-full">
      {/* Bandeau de Recherche */}
      <div className="sticky top-0 z-10 flex flex-col items-center justify-center py-5 bg-foundations-violet-principal w-full gap-4">
        <p className="flex-1 body4-medium text-foundations-blanc">
          Chiffres en détails
        </p>
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="body1-regular border border-foundations-violet-tres-clair rounded-lg bg-foundations-blanc text-foundations-noir h-[48px] w-[288px] pr-[16px] pl-[16px]"
          >
            {allRegions.map((region) => (
              <option key={region.code || "all"} value={region.nom}>
                {region.nom}
              </option>
            ))}
          </select>

          <select
            value={selectedDepartement}
            onChange={handleDepartementChange}
            className="body1-regular border border-foundations-violet-tres-clair rounded-lg bg-foundations-blanc text-foundations-noir h-[48px] w-[288px] pr-[16px] pl-[16px]"
          >
            {filteredDepartements.map((dept) => (
              <option key={dept.code || "all"} value={dept.nom}>
                {dept.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Display */}
      <div className="flex flex-col">
        {isAllSelected && (
          <>
            {/* Default content for "all regions" and "all departements" */}

            {/* Bloc Principal region */}
            <div className="flex flex-col md:flex-row -gap-y-[60px] py-17 px-5 md:px-17.5">
              <div className="grid grid-cols-1 md:grid-cols-[6fr_6fr_1fr] grid-rows-auto md:grid-rows-[1fr_2fr_2fr] gap-x-10 gap-y-10 md:gap-y-0">
                {/* Column 1: FranceMap spans all 3 rows */}
                <div className="md:row-span-3 overflow-hidden">
                  <FranceMapSVG
                    fillColor="var(--color-purple-oxfam-600)"
                    className="size-80 md:size-130"
                    dataPerZone={dataPerRegionMetropole}
                    onRegionClick={handleRegionClick}
                  />
                </div>

                {/* Column 2, Row 1: Title */}
                <div className="md:row-span-1 flex flex-col text-left items-start gap-y-2.5 px-2.5">
                  <h2 className="header-h3 text-foundations-violet-principal">
                    Les femmes maires par régions
                  </h2>
                  <h3 className="label-regular text-foundations-violet-principal">
                    Dernière mise à jour: JJ/MM/AAAA
                  </h3>
                  <div className="bg-foundations-violet-clair rounded-md w-9 h-1.5"></div>
                </div>

                {/* Column 3, Row 1: Empty */}
                <div></div>

                {/* Column 2, Rows 2-3: OutreMer Grid */}
                <div className="md:row-span-2 grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4.25">
                  <OutreMerGrid
                    dataPerRegion={dataPerOutreMer}
                    onRegionClick={handleRegionClick}
                  />
                </div>

                {/* Column 3, Rows 2-3: Buttons */}
                <div className="md:row-span-1 flex flex-row gap-x-4 md:flex-col md:gap-y-4 items-center justify-center md:justify-start">
                  <Link href="/methodologie">
                    <Tooltip
                      text="Méthode de calcul"
                      icon={<QuestionMarkIcon className="w-12.5 h-12.5" />}
                    />
                  </Link>

                  <Link href="/telecharger">
                    <Tooltip
                      text="Télécharger les données"
                      icon={<DownloadIcon className="w-12.5 h-12.5" />}
                    />
                  </Link>
                </div>
              </div>
            </div>

            <BlocClassement
              data={Object.entries(dataPerRegionMetropole).map(
                ([label, { evolution, percentage }]) => ({
                  label,
                  percentage,
                  evolution,
                }),
              )}
              title="Les principaux exécutifs locaux dans une région"
              description="Selon les critères de l’index d’Oxfam à savoir les principaux exécutifs locaux dans une région (présidence de région, présidence de département et mairie de la préfecture du département), le classement des régions françaises."
              derniereMiseAJour={new Date()}
            />
            {/* Bloc Contenu Texte */}
            <div className="flex flex-col md:flex-row gap-x-8 gap-y-10 px-5 md:px-25 py-11 bg-foundations-blanc items-stretch justify-center">
              <div className="flex-1 min-w-0">
                <RegionsSlider
                  regions={regionsDescriptions.top5}
                  title="Une progressive féminisation du pouvoir local"
                  variant="top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <RegionsSlider
                  regions={regionsDescriptions.bottom5}
                  title="Le Boys Club des territoires"
                  variant="bottom"
                />
              </div>
            </div>
          </>
        )}

        {isRegionSelected && (
          <TerritoryView
            territoryName={selectedRegion}
            territoryType="region"
            dataPerZone={allDataPerZone}
            onDepartementClick={handleDepartementClick}
          />
        )}

        {isDepartementSelected && (
          <TerritoryView
            territoryName={selectedDepartement}
            territoryType="departement"
            dataPerZone={allDataPerZone}
            onDepartementClick={handleDepartementClick}
          />
        )}
      </div>
    </div>
  );
}

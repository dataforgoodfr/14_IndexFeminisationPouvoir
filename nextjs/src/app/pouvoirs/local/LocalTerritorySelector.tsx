"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BlocClassement } from "@/components/BlocClassement";
import { FranceMapSVG } from "@/components/FranceMapSVG";
import { DownloadIcon } from "@/components/icons/download";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { OutreMerGrid } from "@/components/OutreMerMap";
import { RegionsSlider } from "@/components/RegionsSlider";
import { ShortDate } from "@/components/ShortDate";
import { Tooltip } from "@/components/Tooltip";
import data_pouvoir_local from "@/data/pouvoir_local.json";
import regionsDescriptions from "@/data/regions-descriptions.json";
import { createZoneDataMap } from "./page";
import { TerritoryView } from "./TerritoryView";

const {
  dateMiseAJour,
  "outre-mer": outreMer,
  departements,
  regions,
  annee,
} = data_pouvoir_local;

export function LocalTerritorySelector() {
  const searchParams = useSearchParams();
  const selectedRegion = searchParams.get("region") || "Toutes les régions";
  const selectedDepartement =
    searchParams.get("departement") || "Tous les départements";

  const dataPerDepartement = createZoneDataMap(departements);
  const dataPerRegionMetropole = createZoneDataMap(regions);
  const dataPerOutreMer = createZoneDataMap(outreMer);
  const allDataPerZone = {
    ...dataPerRegionMetropole,
    ...dataPerOutreMer,
    ...dataPerDepartement,
  };

  // All regions combined
  const allRegions = [
    { nom: "Toutes les régions", code: "" },
    ...regions,
    ...outreMer,
  ];

  // Filtered departements based on selected region
  const filteredDepartements = useMemo(() => {
    if (selectedRegion === "Toutes les régions") {
      return [{ nom: "Tous les départements", code: "" }, ...departements];
    }
    // Check if selected region is an outre-mer
    const regionIsOutreMer = outreMer.some((r) => r.nom === selectedRegion);

    if (regionIsOutreMer) {
      // If it's an outre-mer, we don't have departement-level data, so return only "Tous les départements"
      return [{ nom: "Tous les départements", code: "" }];
    }

    // Find the region code
    const regionObj = regions.find((r) => r.nom === selectedRegion);
    if (!regionObj) return [{ nom: "Tous les départements", code: "" }];

    // Filter departements by region code
    const filtered = departements.filter(
      (d) => d.code_region === regionObj.code,
    );
    return [{ nom: "Tous les départements", code: "" }, ...filtered];
  }, [selectedRegion]);

  // Handle region click from map
  const handleRegionChange = (regionName: string) => {
    updateSearchParams({ region: regionName, departement: null });
  };

  // Handle departement click from map
  const handleDepartementChange = (departementName: string) => {
    const newDepartement =
      departementName === selectedDepartement
        ? "Tous les départements"
        : departementName;
    updateSearchParams({
      region: selectedRegion,
      departement:
        newDepartement === "Tous les départements" ? null : newDepartement,
    });
  };

  // Update URL search params
  const updateSearchParams = (params: {
    region: string | null;
    departement: string | null;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.region && params.region !== "Toutes les régions") {
      searchParams.set("region", params.region);
    }
    if (params.departement) {
      searchParams.set("departement", params.departement);
    }
    window.history.pushState(null, "", `?${searchParams.toString()}`);
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
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(event) => handleRegionChange(event.target.value)}
              className="body1-regular border border-transparent rounded-lg bg-foundations-blanc text-foundations-noir h-12 w-2xs px-4 pr-12 border-r-8"
            >
              {allRegions.map((region) => (
                <option key={region.code || "all"} value={region.nom}>
                  {region.nom}
                </option>
              ))}
            </select>
            {selectedRegion !== "Toutes les régions" && (
              <button
                type="button"
                onClick={() => {
                  updateSearchParams({ region: null, departement: null });
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-foundations-noir hover:text-foundations-violet-principal text-sm"
              >
                ✕
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={selectedDepartement}
              onChange={(event) => handleDepartementChange(event.target.value)}
              className="body1-regular border border-transparent rounded-lg bg-foundations-blanc text-foundations-noir h-12 w-2xs px-4 pr-12 border-r-8"
            >
              {filteredDepartements.map((dept) => (
                <option key={dept.code || "all"} value={dept.nom}>
                  {dept.nom}
                </option>
              ))}
            </select>
            {selectedDepartement !== "Tous les départements" && (
              <button
                type="button"
                onClick={() =>
                  updateSearchParams({
                    region: selectedRegion,
                    departement: null,
                  })
                }
                className="absolute right-8 top-1/2 -translate-y-1/2 text-foundations-noir hover:text-foundations-violet-principal text-sm"
              >
                ✕
              </button>
            )}
          </div>
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
                    onRegionChange={handleRegionChange}
                  />
                </div>

                {/* Column 2, Row 1: Title */}
                <div className="md:row-span-1 flex flex-col text-left items-start gap-y-2.5 px-2.5">
                  <h2 className="header-h3 text-foundations-violet-principal">
                    Les femmes maires par régions
                  </h2>
                  <h3 className="label-regular text-foundations-violet-principal">
                    Dernière mise à jour:{" "}
                    <ShortDate date={new Date(dateMiseAJour)} />
                  </h3>
                  <div className="bg-foundations-violet-clair rounded-md w-9 h-1.5"></div>
                </div>

                {/* Column 3, Row 1: Empty */}
                <div></div>

                {/* Column 2, Rows 2-3: OutreMer Grid */}
                <div className="md:row-span-2 grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4.25">
                  <OutreMerGrid
                    dataPerRegion={dataPerOutreMer}
                    onRegionChange={handleRegionChange}
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
              derniereMiseAJour={new Date(dateMiseAJour)}
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
            onDepartementChange={handleDepartementChange}
            dateMiseAJour={new Date(dateMiseAJour)}
            annee={annee}
          />
        )}

        {isDepartementSelected && (
          <TerritoryView
            territoryName={selectedDepartement}
            territoryType="departement"
            dataPerZone={allDataPerZone}
            onDepartementChange={handleDepartementChange}
            dateMiseAJour={new Date(dateMiseAJour)}
            annee={annee}
          />
        )}
      </div>
    </div>
  );
}

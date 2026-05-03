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
import type { SliderData, SliderItem } from "@/components/TerritorySlider";
import { Tooltip } from "@/components/Tooltip";
import dataPouvoirLocal from "@/data/pouvoir_local.json";
import regionsDescriptions from "@/data/regions-descriptions.json";
import { createZoneDataMap } from "./page";
import { TerritoryView } from "./TerritoryView";
import { LiensCTA, sourceURLs } from '@/components/LiensCTA';

// Score and evolution metrics
export type ScoreEvolution = {
  score: number;
  evolution: number;
};

export type DataPouvoir = {
  score: number;
  evolution: number;
  composantes?: Record<string, ScoreEvolution>;
};

// RegionJson/territory with all local governance sections
export type RegionJsonData = {
  code: string;
  nom: string;
  score: number;
  evolution: number;
  conseilRegional: DataPouvoir;
  conseilDepartemental: DataPouvoir;
  conseilsCommunautaires: DataPouvoir;
  mairesEtConseilsMunicipaux: DataPouvoir;
  communesPlus1000: ScoreEvolution;
};

// Structure JSON d'un département avec ses sections de gouvernance locale
export type DepartementJsonData = {
  code: string;
  nom: string;
  code_region: string;
  score: number;
  evolution: number;
  conseilDepartemental: DataPouvoir;
  conseilsCommunautaires: DataPouvoir;
  mairesEtConseilsMunicipaux: DataPouvoir;
};

// Top-level pouvoir_local.json structure
export type PouvoirLocalJsonData = {
  regions: RegionJsonData[];
  departements: DepartementJsonData[];
  "outre-mer": RegionJsonData[];
  annee: number;
  dateMiseAJour: string;
};

const {
  dateMiseAJour,
  "outre-mer": outreMer,
  departements,
  regions,
  annee,
} = dataPouvoirLocal as PouvoirLocalJsonData;

type SectionConfig = {
  title: string;
  large: Array<{ keys: string[]; label: string }>;
  small: Array<{ keys: string[]; label: string }>;
};

// Configuration mapping for slider item paths
const departementItemsKeys: Record<string, SectionConfig> = {
  conseilDepartemental: {
    title: "Conseil départemental",
    large: [{ keys: ["conseilDepartemental"], label: " " }],
    small: [
      {
        keys: ["conseilDepartemental", "composantes", "presidente_departement"],
        label: "Présidente de département",
      },
      {
        keys: [
          "conseilDepartemental",
          "composantes",
          "directrices_cabinet_pres_departement",
        ],
        label: "Directrice de cabinet d'un.e président.e de département",
      },
    ],
  },
  conseilsCommunautaires: {
    title: "Conseils communautaires",
    large: [{ keys: ["conseilsCommunautaires"], label: " " }],
    small: [
      {
        keys: [
          "conseilsCommunautaires",
          "composantes",
          "presidente_conseils_communautaires",
        ],
        label: "Présidentes des conseils communautaires",
      },
    ],
  },
  mairesEtConseilsMunicipaux: {
    title: "Mairies et conseils municipaux",
    large: [
      { keys: ["mairesEtConseilsMunicipaux"], label: " " },
      {
        keys: ["mairesEtConseilsMunicipaux", "composantes", "maires"],
        label: "Maires",
      },
      {
        keys: [
          "mairesEtConseilsMunicipaux",
          "composantes",
          "maires_prefectures",
        ],
        label: "Maires des préfectures",
      },
    ],
    small: [
      {
        keys: [
          "mairesEtConseilsMunicipaux",
          "composantes",
          "directrices_cabinet_maires",
        ],
        label: "Directrices du cabinet des maires",
      },
      {
        keys: ["mairesEtConseilsMunicipaux", "composantes", "1ere_adjointe"],
        label: "1ère adjointe",
      },
      {
        keys: ["mairesEtConseilsMunicipaux", "composantes", "2e_adjointe"],
        label: "2ème adjointe",
      },
      {
        keys: ["mairesEtConseilsMunicipaux", "composantes", "autres_adjointes"],
        label: "Autres adjointes",
      },
      {
        keys: [
          "mairesEtConseilsMunicipaux",
          "composantes",
          "autres_conseilleres",
        ],
        label: "Autres conseillères",
      },
      {
        keys: [
          "mairesEtConseilsMunicipaux",
          "composantes",
          "maires_communes_moins_1000",
        ],
        label: "communes < 1000 hab.",
      },
    ],
  },
};

const regionItemsKeys: Record<string, SectionConfig> = {
  conseilRegional: {
    title: "Conseil régional",
    large: [{ keys: ["conseilRegional"], label: " " }],
    small: [
      {
        keys: ["conseilRegional", "composantes", "presidente_region"],
        label: "Présidente de région",
      },
      {
        keys: [
          "conseilRegional",
          "composantes",
          "directrices_cabinet_pres_region",
        ],
        label: "Directrice de cabinet d'un.e président.e de région",
      },
    ],
  },
  conseilDepartemental: {
    title: "Conseil départemental",
    large: [{ keys: ["conseilDepartemental"], label: " " }],
    small: [
      {
        keys: ["conseilDepartemental", "composantes", "presidente_departement"],
        label: "Présidentes de département",
      },
      {
        keys: [
          "conseilDepartemental",
          "composantes",
          "directrices_cabinet_pres_departement",
        ],
        label: "Directrices de cabinet d'un.e président.e de département",
      },
    ],
  },
  conseilsCommunautaires: {
    title: "Conseils communautaires",
    large: [{ keys: ["conseilsCommunautaires"], label: " " }],
    small: [
      {
        keys: [
          "conseilsCommunautaires",
          "composantes",
          "presidente_conseils_communautaires",
        ],
        label: "Présidentes de conseils communautaires",
      },
    ],
  },
  mairesEtConseilsMunicipaux: {
    title: "Mairies et conseils municipaux",
    large: [
      { keys: ["mairesEtConseilsMunicipaux"], label: " " },
      {
        keys: ["mairesEtConseilsMunicipaux", "composantes", "maires"],
        label: "Maires",
      },
      {
        keys: [
          "mairesEtConseilsMunicipaux",
          "composantes",
          "maires_prefectures",
        ],
        label: "Maires des préfectures",
      },
    ],
    small: [
      {
        keys: [
          "mairesEtConseilsMunicipaux",
          "composantes",
          "directrices_cabinet_maires",
        ],
        label: "Directrices du cabinet des maires",
      },
      {
        keys: ["mairesEtConseilsMunicipaux", "composantes", "1ere_adjointe"],
        label: "1ère adjointe",
      },
      {
        keys: ["mairesEtConseilsMunicipaux", "composantes", "2e_adjointe"],
        label: "2ème adjointe",
      },
      {
        keys: ["mairesEtConseilsMunicipaux", "composantes", "autres_adjointes"],
        label: "Autres adjointes",
      },
      {
        keys: [
          "mairesEtConseilsMunicipaux",
          "composantes",
          "autres_conseilleres",
        ],
        label: "Autres conseillères",
      },
      {
        keys: [
          "mairesEtConseilsMunicipaux",
          "composantes",
          "maires_communes_moins_1000",
        ],
        label: "communes < 1000 hab.",
      },
    ],
  },
  communesPlus1000: {
    title: "Communes de plus de 1000 habitants",
    large: [{ keys: ["communesPlus1000"], label: " " }],
    small: [],
  },
};

function getScoreEvolutionValueFromKeys(
  obj: unknown,
  keys: string[],
): ScoreEvolution | undefined {
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  const result = current as Record<string, unknown> | undefined;
  if (
    !result ||
    typeof result.score !== "number" ||
    typeof result.evolution !== "number"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[LocalTerritorySelector] Missing or invalid data at path: ${keys.join(".")}`,
      );
    }
    return undefined;
  }
  return { score: result.score, evolution: result.evolution };
}

function buildSliderDatas(
  territoryJsonData: RegionJsonData | DepartementJsonData,
  territoryType: "region" | "departement",
): SliderData[] {
  const itemsKeysConfig =
    territoryType === "region" ? regionItemsKeys : departementItemsKeys;

  const sliderDatas: SliderData[] = [];

  for (const [
    sectionKey,
    { title: titleKey, large: largeKeys, small: smallKeys },
  ] of Object.entries(itemsKeysConfig)) {
    // Check if section exists in the data
    if (!(sectionKey in territoryJsonData)) continue;

    // Init slider_data for this section
    const sliderData: SliderData = {
      title: titleKey,
      largeItems: [],
      smallItems: [],
    };

    // Process large items
    for (const { keys, label: itemTitle } of largeKeys) {
      const scoreEvolutionData = getScoreEvolutionValueFromKeys(
        territoryJsonData,
        keys,
      );

      if (scoreEvolutionData) {
        const sliderItem: SliderItem = {
          valeur: scoreEvolutionData.score,
          evolution: scoreEvolutionData.evolution,
          title: itemTitle,
        };
        sliderData.largeItems.push(sliderItem);
      }
    }

    // Process small items
    for (const { keys, label: itemTitle } of smallKeys) {
      const scoreEvolutionData = getScoreEvolutionValueFromKeys(
        territoryJsonData,
        keys,
      );

      if (scoreEvolutionData) {
        const sliderItem: SliderItem = {
          valeur: scoreEvolutionData.score,
          evolution: scoreEvolutionData.evolution,
          title: itemTitle,
        };
        sliderData.smallItems.push(sliderItem);
      }
    }

    // Only add slider if it has at least one item
    if (sliderData.largeItems.length > 0 || sliderData.smallItems.length > 0) {
      sliderDatas.push(sliderData);
    }
  }

  return sliderDatas;
}

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

  // Get position of Bandeau de Recherche for scrolling
  const getAutoScrollPosition = () => {
    const bandeau = document.getElementById("research-bandeau-local");
    const contentDisplay = document.getElementById("content-display-local");
    if (!bandeau || !contentDisplay) return 150; // default fallback
    // Calculate the position to scroll to: top of content display minus the height of the bandeau
    const bandeauHeight = bandeau.offsetHeight;
    const contentTop =
      contentDisplay.getBoundingClientRect().top + window.scrollY;
    return contentTop - bandeauHeight;
  };

  const selectedRegionObj = useMemo(
    () => [...regions, ...outreMer].find((r) => r.nom === selectedRegion),
    [selectedRegion],
  );
  const regionSliderDatas = useMemo(
    () =>
      selectedRegionObj ? buildSliderDatas(selectedRegionObj, "region") : [],
    [selectedRegionObj],
  );

  const selectedDepartementObj = useMemo(
    () => departements.find((d) => d.nom === selectedDepartement),
    [selectedDepartement],
  );
  const departementSliderDatas = useMemo(
    () =>
      selectedDepartementObj
        ? buildSliderDatas(selectedDepartementObj, "departement")
        : [],
    [selectedDepartementObj],
  );

  // Handle region click from map
  const handleRegionChange = (regionName: string) => {
    updateSearchParams({ region: regionName, departement: null });
    // get position of Bandeau de Recherche to scroll to have it at the top of the page
    window.scrollTo({ top: getAutoScrollPosition(), behavior: "smooth" });
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
    window.scrollTo({ top: getAutoScrollPosition(), behavior: "smooth" });
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
      <div
        id="research-bandeau-local"
        className="sticky top-0 z-10 flex flex-col items-center justify-center py-5 bg-foundations-violet-principal w-full gap-4"
      >
        <p className="flex-1 body4-medium text-foundations-blanc">
          Chiffres en détails
        </p>
        <div className="flex-1 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <select
              value={selectedRegion}
              onChange={(ev) => handleRegionChange(ev.target.value)}
              className="body1-regular border border-transparent border-r-8 bg-foundations-blanc text-foundations-noir h-12 w-2xs pr-4 pl-4"
            >
              {allRegions.map((region) => (
                <option key={region.code || "all"} value={region.nom}>
                  {region.nom}
                </option>
              ))}
            </select>
            {selectedRegion !== "Toutes les régions" && (
              <button
                onClick={() => handleRegionChange("Toutes les régions")}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-foundations-noir hover:text-foundations-violet-principal"
                type="button"
              >
                ✕
              </button>
            )}
          </div>

          <div className="relative flex-1">
            <select
              value={selectedDepartement}
              onChange={(ev) => handleDepartementChange(ev.target.value)}
              className="body1-regular border border-transparent border-r-8 bg-foundations-blanc text-foundations-noir h-12 w-2xs pr-4 pl-4"
              aria-label="Retirer la selection de région"
            >
              {filteredDepartements.map((dept) => (
                <option key={dept.code || "all"} value={dept.nom}>
                  {dept.nom}
                </option>
              ))}
            </select>
            {selectedDepartement !== "Tous les départements" && (
              <button
                onClick={() => handleDepartementChange("Tous les départements")}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-foundations-noir hover:text-foundations-violet-principal"
                type="button"
                aria-label="Retirer la selection de département"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Display */}
      <div id="content-display-local" className="flex flex-col">
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
                <LiensCTA downloadURL={sourceURLs.local.maires} className="md:row-span-1 gap-x-4 md:flex-col md:gap-y-4 items-center justify-center md:justify-start" />
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
                  variant="good"
                />
              </div>
              <div className="flex-1 min-w-0">
                <RegionsSlider
                  regions={regionsDescriptions.bottom5}
                  title="Le Boys Club des territoires"
                  variant="bad"
                />
              </div>
            </div>
          </>
        )}

        {isRegionSelected && selectedRegionObj && (
          <TerritoryView
            annee={annee}
            territoryName={selectedRegion}
            territoryType="region"
            dataPerZone={allDataPerZone}
            onDepartementChange={handleDepartementChange}
            sliderDatas={regionSliderDatas}
            dateMiseAJour={new Date(dateMiseAJour)}
          />
        )}

        {isDepartementSelected && selectedDepartementObj && (
          <TerritoryView
            annee={annee}
            territoryName={selectedDepartement}
            territoryType="departement"
            dataPerZone={allDataPerZone}
            onDepartementChange={handleDepartementChange}
            sliderDatas={departementSliderDatas}
            dateMiseAJour={new Date(dateMiseAJour)}
          />
        )}
      </div>
    </div>
  );
}

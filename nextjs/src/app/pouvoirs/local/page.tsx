import { CollectiviteLocaleBlock } from "@/components/CollectiviteLocaleBlock";
import type { TerritoryType } from "@/components/FranceMapSVG";
import { FranceMapSVG } from "@/components/FranceMapSVG";
import { Hero } from "@/components/Hero";
import { DownloadIcon } from "@/components/icons/download";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { OutreMerGrid } from "@/components/OutreMerMap";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { RegionsSlider } from "@/components/RegionsSlider";
import { PageTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";
import dataPouvoirLocal from "@/data/pouvoir_local.json";
import regionsDescriptions from "@/data/regions-descriptions.json";
import { BlocClassement } from "../../../components/BlocClassement";

const { score, collectivites, annee, dateMiseAJour } = pouvoirData.local;

type DataPouvoirLocal = Record<
  TerritoryType,
  Array<{
    code: string;
    nom: string;
    code_region?: string;
    percentage: number;
    evolution: number;
  }>
>;

export default async function Page() {
  const data_pouvoir_local = dataPouvoirLocal as DataPouvoirLocal;

  const dataPerRegionOutreMer = data_pouvoir_local["outre-mer"].reduce(
    (acc, om) => {
      acc[om.nom] = {
        percentage: om.percentage,
        evolution: om.evolution,
      };
      return acc;
    },
    {} as Record<string, { percentage: number; evolution: number }>,
  );

  const dataPerRegionMetropole = data_pouvoir_local.regions.reduce(
    (acc, region) => {
      acc[region.nom] = {
        percentage: region.percentage,
        evolution: region.evolution,
      };
      return acc;
    },
    {} as Record<string, { percentage: number; evolution: number }>,
  );

  // Combine data of Metropole Region and OutreMer
  const dataPerRegion = { ...dataPerRegionMetropole, ...dataPerRegionOutreMer };

  return (
    <>
      <PageTitle
        id="pouvoir-local"
        title="Pouvoir local"
        subtitle="Texte à ajouter"
      />
      <Hero>
        <PouvoirFigureXL
          valeur={score}
          icon={PouvoirLocalIcon}
          dateMiseAJour={new Date(dateMiseAJour)}
          annee={annee}
          prelabel="au sein du"
          intitule="pouvoir local"
        />
      </Hero>
      <div className="p-8 flex flex-col gap-8">
        {collectivites.map(({ titre, annee, dateMiseAJour, stats }) => (
          <CollectiviteLocaleBlock
            key={titre}
            titre={titre}
            dateMiseAJour={new Date(dateMiseAJour)}
            stats={stats.map((stat) => ({ ...stat, annee }))}
          />
        ))}
      </div>

      {/* Bandeau de Recherche */}
      <div className="sticky top-0 z-10 flex flex-col items-center justify-center py-5 bg-foundations-violet-principal w-full gap-4">
        <p className="flex-1 body4-medium text-foundations-blanc">
          Chiffres en détails
        </p>
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <select className="body1-regular border border-foundations-violet-tres-clair rounded-lg bg-foundations-blanc text-foundations-noir h-[48px] w-[288px] pr-[16px] pl-[16px]">
            <option value="regions">Régions</option>
            <option value="departements">Départements</option>
            <option value="outre-mer">Outre-mer</option>
          </select>
          <select className="body1-regular border border-foundations-violet-tres-clair rounded-lg bg-foundations-blanc text-foundations-noir h-[48px] w-[288px] pr-[16px] pl-[16px]">
            <option value="regions">Régions</option>
            <option value="departements">Départements</option>
            <option value="outre-mer">Outre-mer</option>
          </select>
        </div>
      </div>

      {/* Bloc Principal region */}
      <div className="flex flex-col md:flex-row -gap-y-[60px] py-17 px-5 md:px-17.5">
        <div className="grid grid-cols-1 md:grid-cols-[6fr_6fr_1fr] grid-rows-auto md:grid-rows-[1fr_2fr_2fr] gap-x-10 gap-y-10 md:gap-y-0">
          {/* Column 1: FranceMap spans all 3 rows */}
          <div className="md:row-span-3 overflow-hidden">
            <FranceMapSVG
              fillColor="var(--color-purple-oxfam-600)"
              className="size-80 md:size-130"
              dataPerRegion={dataPerRegionMetropole}
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
            <OutreMerGrid dataPerRegion={dataPerRegionOutreMer} />
          </div>

          {/* Column 3, Rows 2-3: Buttons */}
          <div className="md:row-span-1 flex flex-row gap-x-4 md:flex-col md:gap-y-4 items-center justify-center md:justify-start">
            <button type="button" className="cursor-pointer">
              <QuestionMarkIcon className="w-12.5 h-12.5" />
            </button>
            <button type="button" className="cursor-pointer">
              <DownloadIcon className="w-12.5 h-12.5" />
            </button>
          </div>
        </div>
      </div>

      <BlocClassement
        data={Object.entries(dataPerRegion).map(
          ([label, { evolution, percentage }]) => ({
            label,
            percentage,
            evolution,
          }),
        )}
        title="Les principaux exécutifs locaux dans une région"
        description="Selon les critères de l’index d’Oxfam à savoir les principaux
            exécutifs locaux dans une région (présidence de région, présidence
            de département et mairie de la préfecture du département), le
            classement des régions françaises."
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
  );
}

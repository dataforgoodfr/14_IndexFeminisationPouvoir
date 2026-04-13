import type { TerritoryType } from "@/components/FranceMapSVG";
import { FranceMapSVG } from "@/components/FranceMapSVG";
import { DownloadIcon } from "@/components/icons/download";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { OutreMerGrid } from "@/components/OutreMerMap";
import { PageTitle } from "@/components/PageTitle";
import dataPouvoirLocal from "@/data/pouvoir_local.json";

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

const fetchData = async () => {
  await new Promise((res) => setTimeout(res, 300));
  return dataPouvoirLocal as DataPouvoirLocal;
};

export default async function Page() {
  const data_pouvoir_local = await fetchData();

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

  const dataPerRegion = data_pouvoir_local.regions.reduce(
    (acc, region) => {
      acc[region.nom] = {
        percentage: region.percentage,
        evolution: region.evolution,
      };
      return acc;
    },
    {} as Record<string, { percentage: number; evolution: number }>,
  );

  return (
    <div>
      <PageTitle title="Pouvoir local" subtitle="Texte à ajouter" />

      {/* Bandeau de Recherche */}
      <div className="sticky top-0 z-10 flex flex-col items-center justify-center pb-[20px] pt-[20px] bg-foundations-violet-principal w-full max-h-[142px] gap-[17px]">
        <p className="flex-1 body4-medium text-foundations-blanc">
          Chiffres en détails
        </p>
        <div className="flex-1 flex flex-row gap-[16px]">
          <select className="body1-regular border border-foundations-violet-tres-clair rounded-[8px] bg-foundations-blanc text-foundations-noir h-[48px] w-[288px] pr-[16px] pl-[16px]">
            <option value="regions">Régions</option>
            <option value="departements">Départements</option>
            <option value="outre-mer">Outre-mer</option>
          </select>
          <select className="body1-regular border border-foundations-violet-tres-clair rounded-[8px] bg-foundations-blanc text-foundations-noir h-[48px] w-[288px] pr-[16px] pl-[16px]">
            <option value="regions">Régions</option>
            <option value="departements">Départements</option>
            <option value="outre-mer">Outre-mer</option>
          </select>
        </div>
      </div>

      {/* Bloc Principal region */}
      <div className="grid grid-cols-[6fr_6fr_1fr] grid-rows-[1fr_2fr_2fr] gap-x-[40px] py-[68px]">
        {/* Column 1: FranceMap spans all 3 rows */}
        <div className="row-span-3 overflow-hidden">
          <FranceMapSVG
            fillColor="var(--color-purple-oxfam-600)"
            className="size-130"
            dataPerRegion={dataPerRegion}
          />
        </div>

        {/* Column 2, Row 1: Title */}
        <div className="row-span-1 flex flex-col text-left items-start gap-y-[10px] px-[10px]">
          <h2 className="header-h3 text-foundations-violet-principal">
            Les femmes maires par régions
          </h2>
          <h3 className="label-regular text-foundations-violet-principal">
            Dernière mise à jour: JJ/MM/AAAA
          </h3>
          <div className="bg-foundations-violet-clair rounded-[6px] w-[36px] h-[6px]"></div>
        </div>

        {/* Column 3, Row 1: Empty */}
        <div></div>

        {/* Column 2, Rows 2-3: OutreMer Grid */}
        <div className="row-span-2 grid grid-cols-4 gap-x-[8px] gap-y-[17px]">
          <OutreMerGrid dataPerRegion={dataPerRegionOutreMer} />
        </div>

        {/* Column 3, Rows 2-3: Buttons */}
        <div className="row-span-1 flex flex-col gap-y-[16px] items-center justify-start">
          <button type="button" className="cursor-pointer">
            <QuestionMarkIcon className="w-16 h-16" />
          </button>
          <button type="button" className="cursor-pointer">
            <DownloadIcon className="w-16 h-16" />
          </button>
        </div>
      </div>
      {/* Bloc Classement */}
      <div></div>
      {/* Bloc Contenu Texte */}
      <div></div>
    </div>
  );
}

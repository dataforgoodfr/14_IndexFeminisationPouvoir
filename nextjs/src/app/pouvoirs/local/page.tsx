import { LocalTerritorySelector } from "@/app/pouvoirs/local/LocalTerritorySelector";
import { CollectiviteLocaleBlock } from "@/components/CollectiviteLocaleBlock";
import type { TerritoryType } from "@/components/FranceMapSVG";
import { Hero } from "@/components/Hero";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { PageTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { score, collectivites } = pouvoirData.local;
export type zoneData = Array<{
  code: string;
  nom: string;
  code_region?: string;
  percentage: number;
  evolution: number;
}>;

export type DataPouvoirLocal = Record<TerritoryType, zoneData>;

export function createZoneDataMap(
  data: Array<{
    nom: string;
    percentage: number;
    evolution: number;
  }>,
): Record<string, { percentage: number; evolution: number }> {
  return data.reduce(
    (acc, zone) => {
      acc[zone.nom] = {
        percentage: zone.percentage,
        evolution: zone.evolution,
      };
      return acc;
    },
    {} as Record<string, { percentage: number; evolution: number }>,
  );
}

export default function Page() {
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
          dateMiseAJour={new Date()}
          intitule="au sein du pouvoir local"
        />
      </Hero>
      <div className="p-8 flex flex-col gap-8 w-full">
        {collectivites.map(({ titre, annee, dateMiseAJour, stats }) => (
          <CollectiviteLocaleBlock
            key={titre}
            titre={titre}
            dateMiseAJour={new Date(dateMiseAJour)}
            stats={stats.map((stat) => ({ ...stat, annee }))}
          />
        ))}
      </div>
      <LocalTerritorySelector />
    </>
  );
}

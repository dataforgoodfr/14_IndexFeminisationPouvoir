import { Suspense } from "react";
import { LocalTerritorySelector } from "@/app/pouvoirs/local/LocalTerritorySelector";
import { CollectiviteLocaleBlock } from "@/components/CollectiviteLocaleBlock";
import { Hero } from "@/components/Hero";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { PageTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { score, collectivites, annee, dateMiseAJour } = pouvoirData.local;

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
        subtitle="Le pouvoir local correspond aux élu·e·s des collectivités territoriales."
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
      <div className="p-8 flex flex-row flex-wrap gap-8 w-full justify-center">
        <CollectiviteLocaleBlock
          titre="Régions"
          dateMiseAJour={new Date(collectivites.régions.dateMiseAJour)}
          stats={[
            {
              role: "présidant une région",
              annee: collectivites.régions.annee,
              valeur: collectivites.régions.composantes.présidentes.valeur,
              evolution:
                collectivites.régions.composantes.présidentes.evolution,
            },
            {
              role: "directrice de cabinet d'un.e président.e de région",
              annee: collectivites.régions.annee,
              valeur: collectivites.régions.composantes.présidentes.valeur,
              evolution:
                collectivites.régions.composantes.présidentes.evolution,
            },
          ]}
        />
        <CollectiviteLocaleBlock
          titre="Départements"
          dateMiseAJour={new Date(collectivites.départements.dateMiseAJour)}
          stats={[
            {
              role: "présidant un département",
              annee: collectivites.départements.annee,
              valeur: collectivites.départements.composantes.présidentes.valeur,
              evolution:
                collectivites.départements.composantes.présidentes.evolution,
            },
            {
              role: "directrice de cabinet d'un.e président.e de département",
              annee: collectivites.départements.annee,
              valeur: collectivites.départements.composantes.présidentes.valeur,
              evolution:
                collectivites.départements.composantes.présidentes.evolution,
            },
          ]}
        />
        <CollectiviteLocaleBlock
          titre="Communes"
          dateMiseAJour={new Date(collectivites.communes.dateMiseAJour)}
          stats={[
            {
              role: "maires",
              annee: collectivites.communes.annee,
              valeur: collectivites.communes.composantes.maires.valeur,
              evolution: collectivites.communes.composantes.maires.evolution,
            },
            {
              role: "maires de préfecture",
              annee: collectivites.communes.annee,
              valeur:
                collectivites.communes.composantes.maires_prefecture.valeur,
              evolution:
                collectivites.communes.composantes.maires_prefecture.evolution,
            },
            {
              role: "directrice de cabinet d'un.e maire de préfecture",
              annee: collectivites.communes.annee,
              valeur:
                collectivites.communes.composantes
                  .directrices_cabinet_prefecture.valeur,
              evolution:
                collectivites.communes.composantes
                  .directrices_cabinet_prefecture.evolution,
            },
          ]}
        />
      </div>
      <Suspense fallback={<div />}>
        <LocalTerritorySelector />
      </Suspense>
    </>
  );
}

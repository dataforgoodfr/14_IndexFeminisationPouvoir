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
    score: number;
    evolution: number;
  }>,
): Record<string, { percentage: number; evolution: number }> {
  return data.reduce(
    (acc, zone) => {
      acc[zone.nom] = {
        percentage: zone.score,
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
      <div className="flex w-full justify-center p-4">
        <div className="flex w-full max-w-7xl flex-col gap-8 xl:flex-row xl:items-start">
          <div className="flex w-full flex-col gap-8 xl:flex-1">
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
                  valeur:
                    collectivites.régions.composantes.directrices_cabinet
                      .valeur,
                  evolution:
                    collectivites.régions.composantes.directrices_cabinet
                      .evolution,
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
                  valeur:
                    collectivites.départements.composantes.présidentes.valeur,
                  evolution:
                    collectivites.départements.composantes.présidentes
                      .evolution,
                },
                {
                  role: "directrice de cabinet d'un.e président.e de département",
                  annee: collectivites.départements.annee,
                  valeur:
                    collectivites.départements.composantes.directrices_cabinet
                      .valeur,
                  evolution:
                    collectivites.départements.composantes.directrices_cabinet
                      .evolution,
                },
              ]}
            />
          </div>
          <div className="flex w-full flex-col xl:flex-1">
            <CollectiviteLocaleBlock
              titre="Communes"
              dateMiseAJour={new Date(collectivites.communes.dateMiseAJour)}
              stats={[
                {
                  role: "maires",
                  annee: collectivites.communes.annee,
                  valeur: collectivites.communes.composantes.maires.valeur,
                  evolution:
                    collectivites.communes.composantes.maires.evolution,
                },
                {
                  role: "maires de préfecture",
                  annee: collectivites.communes.annee,
                  valeur:
                    collectivites.communes.composantes.maires_prefecture.valeur,
                  evolution:
                    collectivites.communes.composantes.maires_prefecture
                      .evolution,
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
        </div>
      </div>
      <Suspense fallback={<div />}>
        <LocalTerritorySelector />
      </Suspense>
    </>
  );
}

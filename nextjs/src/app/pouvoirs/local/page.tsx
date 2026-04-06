import { CollectiviteLocaleBlock } from "@/components/CollectiviteLocaleBlock";
import { Hero } from "@/components/Hero";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PageTitle } from "@/components/PageTitle";
import { PouvoirFigure } from "@/components/PouvoirFigure";
import pouvoirData from "@/data/pouvoir.json";

const { score, composantes } = pouvoirData.local;

export default function Page() {
  return (
    <>
      <PageTitle title="Pouvoir local" subtitle="Texte à ajouter" />
      <Hero>
        <PouvoirFigure
          valeur={score}
          icon={PouvoirLocalIcon}
          dateMiseàJour={new Date()}
          texte="Texte à ajouter"
        />
      </Hero>
      <div className="p-8 flex flex-col gap-8">
        <CollectiviteLocaleBlock
          titre="Régions"
          dateMiseAJour={new Date("2025-01-01")}
          stats={[
            {
              valeur: composantes.presidentesRegion,
              role: "présidant une région",
              annee: 2025,
            },
            {
              valeur: composantes.directricesCabinetRegion,
              role: "directrices de cabinet d'un.e président.e de région",
              annee: 2025,
            },
          ]}
        />
        <CollectiviteLocaleBlock
          titre="Départements"
          dateMiseAJour={new Date("2025-01-01")}
          stats={[
            {
              valeur: composantes.presidentsDepartement,
              role: "présidant un département",
              annee: 2025,
            },
            {
              valeur: composantes.directricesCabinetDepartement,
              role: "directrices de cabinet d'un.e président.e de département",
              annee: 2025,
            },
          ]}
        />
        <CollectiviteLocaleBlock
          titre="Communes"
          dateMiseAJour={new Date("2025-01-01")}
          stats={[
            {
              valeur: composantes.maires,
              role: "maires",
              annee: 2025,
            },
            {
              valeur: composantes.mairesPrefecture,
              role: "maires de préfecture",
              annee: 2025,
            },
            {
              valeur: composantes.directricesCabinetMairiesPrefecture,
              role: "directrices de cabinet des mairies de préfecture",
              annee: 2025,
            },
          ]}
        />
      </div>
    </>
  );
}

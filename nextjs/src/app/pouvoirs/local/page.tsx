import { Hero } from "@/components/Hero";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PageTitle } from "@/components/PageTitle";
import { PouvoirFigure } from "@/components/PouvoirFigure";
import { CollectiviteLocaleBlock } from "@/components/CollectiviteLocaleBlock";
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
        <CollectiviteLocaleBlock titre="Départements" stats={[]} />
        <CollectiviteLocaleBlock titre="Communes" stats={[]} />
      </div>
    </>
  );
}

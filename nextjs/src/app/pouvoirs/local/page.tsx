import { CollectiviteLocaleBlock } from "@/components/CollectiviteLocaleBlock";
import { Hero } from "@/components/Hero";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { PageTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { score, collectivites } = pouvoirData.local;

export default function Page() {
  return (
    <>
      <PageTitle title="Pouvoir local" subtitle="Texte à ajouter" />
      <Hero>
        <PouvoirFigureXL
          valeur={score}
          icon={PouvoirLocalIcon}
          dateMiseàJour={new Date()}
          intitule="au sein du pouvoir local"
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
    </>
  );
}

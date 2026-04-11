import { CollectiviteLocaleBlock } from "@/components/CollectiviteLocaleBlock";
import { Hero } from "@/components/Hero";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PageTitle } from "@/components/PageTitle";
import { PouvoirFigure } from "@/components/PouvoirFigure";
import pouvoirData from "@/data/pouvoir.json";

const { score, collectivites } = pouvoirData.local;

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

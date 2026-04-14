import GenderDistributionChart from "@/components/charts/GenderDistributionChart";
import { Hero } from "@/components/Hero";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PageTitle } from "@/components/PageTitle";
import { PouvoirFigure } from "@/components/PouvoirFigure";
import pouvoirData from "@/data/pouvoir.json";

const { composantes, score } = pouvoirData.executif;

export default function Page() {
  return (
    <>
      <PageTitle title="Pouvoir éxécutif" subtitle="Texte à ajouter" />
      <Hero>
        <PouvoirFigure
          valeur={score}
          icon={PouvoirExecutifIcon}
          dateMiseàJour={new Date()}
          texte="Texte à ajouter"
        />
      </Hero>
      <div className="p-8 flex flex-col gap-8">
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="postes-regaliens"
        >
          Femmes au postes régaliens
        </h2>
        <GenderDistributionChart
          pourcentage={composantes.ministeres_regaliens}
        />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="gouvernement"
        >
          Femmes au Gouvernement
        </h2>
        <GenderDistributionChart pourcentage={composantes.gouvernement} />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="cabinet-president"
        >
          Cabinet du président de la république
        </h2>
        <GenderDistributionChart pourcentage={composantes.cabinet_presidence} />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="cabinet-premier-ministre"
        >
          Cabinet du premier ministre
        </h2>
        <GenderDistributionChart
          pourcentage={composantes.cabiner_premier_ministre}
        />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="cabinet-gouvernement"
        >
          Femme dirigeant un cabinet au gouvernement
        </h2>
        <GenderDistributionChart
          pourcentage={composantes.directrices_cabinet_gouvernement}
        />
      </div>
    </>
  );
}

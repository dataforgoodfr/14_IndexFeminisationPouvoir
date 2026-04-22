import GenderDistributionChart from "@/components/charts/GenderDistributionChart";
import { Hero } from "@/components/Hero";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { PageTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { composantes, score, annee, dateMiseAJour } = pouvoirData.executif;

export default function Page() {
  return (
    <>
      <PageTitle
        id="pouvoir-executif"
        title="Pouvoir exécutif"
        subtitle="Le pouvoir exécutif regroupe la présidence de la République, son cabinet, le cabinet du Premier ministre, les ministères régaliens et les cabinets ministériels."
      />
      <Hero>
        <PouvoirFigureXL
          valeur={score}
          icon={PouvoirExecutifIcon}
          annee={annee}
          intitule="au sein du pouvoir exécutif"
          dateMiseAJour={new Date(dateMiseAJour)}
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
          pourcentage={composantes.ministeres_regaliens.score}
        />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="gouvernement"
        >
          Femmes au Gouvernement
        </h2>
        <GenderDistributionChart pourcentage={composantes.gouvernement.score} />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="cabinet-president"
        >
          Cabinet du président de la république
        </h2>
        <GenderDistributionChart
          pourcentage={composantes.cabinet_presidence.score}
        />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="cabinet-premier-ministre"
        >
          Cabinet du premier ministre
        </h2>
        <GenderDistributionChart
          pourcentage={composantes.cabiner_premier_ministre.score}
        />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="cabinet-gouvernement"
        >
          Femme dirigeant un cabinet au gouvernement
        </h2>
        <GenderDistributionChart
          pourcentage={composantes.directrices_cabinet_gouvernement.score}
        />
      </div>
    </>
  );
}

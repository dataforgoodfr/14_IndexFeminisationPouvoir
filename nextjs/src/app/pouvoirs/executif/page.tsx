import GenderDistributionChart from "@/components/charts/GenderDistributionChart";
import { Hero } from "@/components/Hero";
import { FemmeElueIcon } from "@/components/icons/femme-elue";
import { PageTitle } from "@/components/PageTitle";
import { PouvoirFigure } from "@/components/PouvoirFigure";

const executif = {
  gouvernement: 50,
  postes_regaliens: 0,
  cabinet_president: 35.2,
  cabinet_premier_ministre: 42.9,
  cabinet_gouvernement: 20,
};
export default function Page() {
  const parite =
    Object.values(executif).reduce((acc, val) => acc + val, 0) /
    Object.keys(executif).length;

  return (
    <div className="flex flex-col mt-20 gap-8  items-center justify-center ">
      <PageTitle title="Pouvoir éxécutif" subtitle="Texte à ajouter" />
      <Hero>
        <PouvoirFigure
          valeur={parite}
          icon={FemmeElueIcon}
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
        <GenderDistributionChart pourcentage={executif.postes_regaliens} />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="gouvernement"
        >
          Femmes au Gouvernement
        </h2>
        <GenderDistributionChart pourcentage={executif.gouvernement} />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="cabinet-president"
        >
          Cabinet du président de la république
        </h2>
        <GenderDistributionChart pourcentage={executif.cabinet_president} />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="cabinet-premier-ministre"
        >
          Cabinet du premier ministre
        </h2>
        <GenderDistributionChart
          pourcentage={executif.cabinet_premier_ministre}
        />
        <h2
          className="text-2xl/relaxed font-bold text-center"
          id="cabinet-gouvernement"
        >
          Femme dirigeant un cabinet au gouvernement
        </h2>
        <GenderDistributionChart pourcentage={executif.cabinet_gouvernement} />
      </div>
    </div>
  );
}

import ParlementChart from "@/components/charts/ParlementChart";
import { InfoBox } from "@/components/InfoBox";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureS } from "@/components/PouvoirFigureS";
import { SectionTitle } from "@/components/titles";
import { parlementaire } from "@/data/pouvoir.json";

const { annee, score, composantes } =
  parlementaire.composantes.assemblee_nationale;

export default function Page() {
  return (
    <div className="contents" data-current-parlement="assemblee-nationale">
      <SectionTitle title="Assemblée Nationale" />
      <div className="mt-8 max-w-4xl flex flex-col items-center justify-center gap-4 mb-12">
        <div className="w-full lg:w-lg">
          <ParlementChart parite={score / 100} />
        </div>
        <PouvoirFigureL
          valeur={score}
          intitule="députées"
          annee={annee}
          evolution={100}
        />
        <InfoBox>
          <p>Les député.e.s de l'Assemblée Nationale :</p>
          <ul className="font-semibold">
            <li>- Votent les lois et contrôlent l'action du gouvernement</li>
            <li>- Peuvent censurer le gouvernement</li>
          </ul>
          <p className="mt-2 font-semibold">
            Ils sont élus par les Français.es.
          </p>
        </InfoBox>
        <div className="divider-dashed-horizontal w-full my-8" />
        <div className="flex flex-col lg:flex-row my-4 lg:my-0 gap-12 lg:gap-6">
          <PouvoirFigureS
            valeur={composantes.presidente_commission}
            intitule="présidant une commission"
            annee={annee}
          />
          <div className="divider-dashed" />
          <PouvoirFigureS
            valeur={composantes.bureau}
            intitule="au bureau de l'assemblée nationale"
            annee={annee}
          />
          <div className="divider-dashed" />
          <PouvoirFigureS
            valeur={composantes.presidente_groupe}
            intitule="présidant un groupe parlementaire"
            annee={annee}
          />
        </div>
      </div>
    </div>
  );
}

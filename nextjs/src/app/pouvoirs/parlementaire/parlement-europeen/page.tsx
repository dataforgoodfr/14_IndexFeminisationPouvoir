import ParlementChart from "@/components/charts/ParlementChart";
import { InfoBox } from "@/components/InfoBox";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { SectionTitle } from "@/components/titles";
import { parlementaire } from "@/data/pouvoir.json";

const { annee, score } = parlementaire.composantes.europeen;

export default function Page() {
  return (
    <div className="contents" data-current-parlement="parlement-europeen">
      <SectionTitle title="Parlement Européen" />
      <div className="mt-8 max-w-4xl flex flex-col items-center justify-center gap-4 mb-12">
        <div className="w-full lg:w-lg">
          <ParlementChart parite={score / 100} />
        </div>
        <PouvoirFigureL
          valeur={score}
          intitule="députées européennes"
          annee={annee}
          evolution={100}
        />
        <InfoBox>
          <p>Les député.e.s du Parlement Européen :</p>
          <ul className="font-semibold">
            <li>- Votent les lois</li>
            <li>- Contrôlent l'action de l'Union Européenne</li>
            <li>- Etablissent le budget de l'Union Européenne</li>
          </ul>
          <p className="mt-2 font-semibold">
            Ils sont élus par les Européen.nes.
          </p>
        </InfoBox>
      </div>
    </div>
  );
}

import { BlocAnalyseRapport } from "@/components/BlocAnalyseRapport";
import { BlocClassement } from "@/components/BlocClassement";
import ParlementChart from "@/components/charts/ParlementChart";
import { InfoBox } from "@/components/InfoBox";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureS } from "@/components/PouvoirFigureS";
import { SectionTitle } from "@/components/titles";
import { parlementaire } from "@/data/pouvoir.json";

const { annee, score, evolution, composantes, analyse, parite_groupes } =
  parlementaire.composantes.assemblee_nationale;

export default function Page() {
  return (
    <>
      <SectionTitle id="assemblee-nationale" title="Assemblée Nationale" />
      <div className="mt-8 max-w-4xl flex flex-col items-center justify-center gap-4 ">
        <div className="w-full lg:w-lg">
          <ParlementChart parite={score / 100} />
        </div>
        <PouvoirFigureL
          valeur={score}
          intitule="députées"
          annee={annee}
          evolution={evolution}
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
        <div className="hidden lg:flex divider-dashed-horizontal w-full my-8" />
        <div className="flex flex-col lg:flex-row my-4 lg:my-0 gap-12 lg:gap-6">
          <PouvoirFigureS
            valeur={composantes.presidente_commission.score}
            intitule="présidant une commission"
            evolution={composantes.presidente_commission.evolution}
            annee={composantes.presidente_commission.annee}
          />
          <div className="hidden lg:flex divider-dashed" />
          <div className="flex lg:hidden divider-dashed-horizontal-mobile" />
          <PouvoirFigureS
            valeur={composantes.bureau.score}
            intitule="au bureau de l'assemblée nationale"
            annee={composantes.bureau.annee}
            evolution={composantes.bureau.evolution}
          />
          <div className="hidden lg:flex divider-dashed" />
          <div className="flex lg:hidden divider-dashed-horizontal-mobile" />
          <PouvoirFigureS
            valeur={composantes.presidente_groupe.score}
            intitule="présidant un groupe parlementaire"
            annee={composantes.presidente_groupe.annee}
            evolution={composantes.presidente_groupe.evolution}
          />
        </div>
      </div>
      <div className="w-full">
        <BlocAnalyseRapport description={analyse} />
        <BlocClassement
          title="Taux de parité des groupes politiques"
          description={parite_groupes.description}
          data={parite_groupes.data.map(({ nom, score }) => ({
            label: nom,
            percentage: score,
          }))}
          derniereMiseAJour={new Date(parite_groupes.dateMiseAJour)}
          thumbsUpTopValue={0}
          thumbsDownBottomValue={0}
        />
      </div>
    </>
  );
}

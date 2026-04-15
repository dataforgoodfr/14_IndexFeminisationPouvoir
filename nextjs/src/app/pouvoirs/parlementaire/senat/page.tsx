import { BlocAnalyseRapport } from "@/components/BlocAnalyseRapport";
import { BlocClassement } from "@/components/BlocClassement";
import ParlementChart from "@/components/charts/ParlementChart";
import { InfoBox } from "@/components/InfoBox";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureS } from "@/components/PouvoirFigureS";
import { SectionTitle } from "@/components/titles";
import { parlementaire } from "@/data/pouvoir.json";

const { annee, score, composantes, analyse, parite_groupes } =
  parlementaire.composantes.senat;

export default function Page() {
  return (
    <>
      <SectionTitle id="senat" title="Sénat" />
      <div className="mt-8 max-w-4xl flex flex-col items-center justify-center gap-4">
        <div className="w-full lg:w-lg">
          <ParlementChart parite={score / 100} />
        </div>
        <PouvoirFigureL
          valeur={score}
          intitule="sénatrices"
          annee={annee}
          evolution={100}
        />
        <InfoBox>
          <p>Les sénateur.rices :</p>
          <ul className="font-semibold">
            <li>- Votent les lois</li>
            <li>- Contrôlent l'action du gouvernement</li>
          </ul>
          <p className="mt-2 font-semibold">
            Ils sont élus au suffrage universel indirect par les Grands
            Électeur.rices.
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
            intitule="au bureau du Sénat"
            annee={annee}
          />
          <div className="divider-dashed" />
          <PouvoirFigureS
            valeur={composantes.presidente_groupe}
            intitule="présidant un groupe au Sénat"
            annee={annee}
          />
        </div>
      </div>
      <div className="w-full">
        <BlocAnalyseRapport description={analyse} />
        <BlocClassement
          title="Taux de parité des groupes politiques"
          description={parite_groupes.description}
          data={parite_groupes.data.map(({ nom, score, evolution }) => ({
            label: nom,
            percentage: score,
            evolution,
          }))}
          derniereMiseAJour={new Date(parite_groupes.dateMiseAJour)}
        />
      </div>
    </>
  );
}

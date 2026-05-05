import { DoughnutChart } from "./charts/DoughnutChart";
import { EvolutionBadge } from "./EvolutionBadge";
import { LiensCTA } from "./LiensCTA";
import { ShortDate } from "./ShortDate";

export type PouvoirFigureXLProps = {
  valeur: number;
  intitule: string;
  prelabel?: string;
  dateMiseAJour: Date;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  annee: number;
  evolution: number;
};
export const PouvoirFigureXL = ({
  valeur,
  icon: Icon,
  dateMiseAJour,
  prelabel,
  intitule,
  annee,
  evolution,
}: PouvoirFigureXLProps) => (
  <div className="flex flex-col lg:flex-row gap-9 items-center">
    <DoughnutChart value={valeur} className="w-68 h-68" icon={Icon} />
    <div className="flex flex-col justify-center text-foundations-blanc">
      <div className="flex flex-row  items-start gap-2">
        <span className="text-chiffre-xl">{valeur.toFixed(2)} %</span>
        {evolution !== undefined && (
          <EvolutionBadge value={evolution} display_a_venir={valeur === null} />
        )}
      </div>
      <span className="text-femmes-xl">de femmes</span>
      <span className="text-intitule-l">{prelabel}</span>
      <span className="text-intitule-xl">{intitule}</span>
      <span className="text-intitule-l">en {annee}</span>
      <span className="label-medium">
        Dernière mise à jour : <ShortDate date={dateMiseAJour} />
      </span>
    </div>
    <LiensCTA color="white" />
  </div>
);

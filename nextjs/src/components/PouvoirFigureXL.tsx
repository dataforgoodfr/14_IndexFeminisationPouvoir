import { DoughnutChart } from "./charts/DoughnutChart";
import { ShortDate } from "./ShortDate";

export type PouvoirFigureXLProps = {
  valeur: number;
  intitule: string;
  prelabel?: string;
  dateMiseAJour: Date;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  annee: number;
};
export const PouvoirFigureXL = ({
  valeur,
  icon: Icon,
  dateMiseAJour,
  prelabel,
  intitule,
  annee,
}: PouvoirFigureXLProps) => (
  <div className="flex flex-col lg:flex-row gap-9 items-center lg:items-start">
    <DoughnutChart value={valeur} className="w-68 h-68" icon={Icon} />
    <div className="flex flex-col justify-center text-foundations-blanc">
      <span className="text-chiffre-xl">{valeur.toFixed(2)} %</span>
      <span className="text-femmes-xl">de femmes</span>
      <span className="text-intitule-l">{prelabel}</span>
      <span className="text-intitule-xl">{intitule}</span>
      <span className="text-intitule-l">en {annee}</span>
      <span className="label-medium">
        Dernière mise à jour : <ShortDate date={dateMiseAJour} />
      </span>
    </div>
  </div>
);

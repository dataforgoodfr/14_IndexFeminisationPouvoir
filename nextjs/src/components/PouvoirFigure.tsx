import { DoughhnutChart } from "./charts/DoughnutChart";

export type PouvoirFigureProps = {
  valeur: number;
  texte: React.ReactNode;
  dateMiseàJour: Date;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
export const PouvoirFigure = ({
  valeur,
  icon: Icon,
  dateMiseàJour,
  texte,
}: PouvoirFigureProps) => (
  <div className="flex flex-col  lg:flex-row gap-9">
    <DoughhnutChart value={valeur} className="w-68 h-68" icon={Icon} />
    <div className="flex flex-col justify-center">
      <span className="text-chiffre-xl text-foundations-blanc">
        {valeur.toFixed(2)} %
      </span>
      <span className="text-femmes-xl text-foundations-blanc">{texte}</span>
      <span className="label-medium text-foundations-blanc">
        Dernière mise à jour : {dateMiseàJour.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </span>
    </div>
  </div>
);

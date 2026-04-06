import type { ComponentType, ReactNode, SVGProps } from "react";
import { DoughnutChart } from "./charts/DoughnutChart";

type BaseProps = { valeur: number };

type HeroProps = BaseProps & {
  variant?: "hero";
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  texte: ReactNode;
  dateMiseàJour: Date;
};

type MiniProps = BaseProps & {
  variant: "mini";
  role: string;
  annee?: number;
  evolution?: number;
};

export type PouvoirFigureProps = HeroProps | MiniProps;

const EvolutionBadge = ({ value }: { value: number }) => {
  const label = `${value > 0 ? "+" : ""}${value}%`;
  const colorClass =
    value >= 0 ? "bg-green-oxfam-500" : "bg-foundations-rouge-principal";
  return (
    <span
      className={`${colorClass} text-white text-xs font-bold px-2 py-0.5 rounded`}
    >
      {label}
    </span>
  );
};

export const PouvoirFigure = (props: PouvoirFigureProps) => {
  const { valeur } = props;

  if (props.variant === "mini") {
    const { role, annee, evolution } = props;
    const anneeAffichee = annee ?? new Date().getFullYear();
    const pourcentageFormate = valeur.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    return (
      <div className="flex flex-row gap-9 items-center">
        <DoughnutChart
          value={valeur}
          className="w-[110px] h-[110px] shrink-0"
          variant="light"
        />
        <div className="flex flex-col justify-center">
          <div className="flex flex-row items-start gap-2">
            <span className="text-chiffre-l text-purple-oxfam-600 leading-none">
              {pourcentageFormate}%
            </span>
            {evolution !== undefined && <EvolutionBadge value={evolution} />}
          </div>
          <span className="text-femmes-xl text-purple-oxfam-600 lowercase">
            de femmes
          </span>
          <span className="header-h3 text-purple-oxfam-600 uppercase">
            {role}
          </span>
          <span className="header-h3 text-purple-oxfam-600 uppercase">
            en {anneeAffichee}
          </span>
        </div>
      </div>
    );
  }

  // Default: hero variant
  const { icon: Icon, dateMiseàJour, texte } = props;
  return (
    <div className="flex flex-col lg:flex-row gap-9">
      <DoughnutChart value={valeur} className="w-68 h-68" icon={Icon} />
      <div className="flex flex-col justify-center">
        <span className="text-chiffre-xl text-foundations-blanc">
          {valeur.toFixed(2)} %
        </span>
        <span className="text-femmes-xl text-foundations-blanc">{texte}</span>
        <span className="label-medium text-foundations-blanc">
          Dernière mise à jour :{" "}
          {dateMiseàJour.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";
import { DoughnutChart } from "./charts/DoughnutChart";
import { EvolutionBadge } from "./EvolutionBadge";

export type PouvoirFigureLProps = {
  valeur: number;
  /** Affiché en majuscules, e.g. "présidant une région" */
  intitule: string;
  annee: number;
  evolution?: number;
  withChart?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  chartClassName?: string;
};

export const PouvoirFigureL = ({
  valeur,
  intitule,
  annee,
  evolution,
  withChart,
  icon,
  chartClassName,
}: PouvoirFigureLProps) => {
  const anneeAffichee = annee;
  const pourcentageFormate = valeur.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-9 items-center lg:items-start">
      {withChart && (
        <DoughnutChart
          value={valeur}
          className={cn("w-28 h-28 shrink-0", chartClassName)}
          variant="light"
          icon={icon}
        />
      )}
      <div
        className={cn(
          "flex justify-center",
          withChart ? "flex-col" : "flex-row items-center gap-4",
        )}
      >
        <div className="flex flex-row items-start gap-2">
          <span className="text-chiffre-l text-foundations-violet-principal leading-none">
            {pourcentageFormate}%
          </span>
          {evolution !== undefined && <EvolutionBadge value={evolution} />}
        </div>
        <div className="flex flex-col text-foundations-violet-principal">
          <span className="text-femmes-l">de femmes</span>
          <span className="text-intitule-l">{intitule}</span>
          <span className="text-intitule-m">en {anneeAffichee}</span>
        </div>
      </div>
    </div>
  );
};

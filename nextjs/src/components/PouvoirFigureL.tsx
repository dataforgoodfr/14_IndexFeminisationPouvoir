import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";
import { DoughnutChart } from "./charts/DoughnutChart";
import { EvolutionBadge } from "./EvolutionBadge";
import { LiensCTA } from "./LiensCTA";

export type PouvoirFigureLProps = {
  valeur: number;
  /** Affiché en majuscules, e.g. "présidant une région" */
  intitule: React.ReactNode;
  annee: number;
  evolution?: number;
  withChart?: boolean;
  withButtons?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  chartClassName?: string;

  // TODO: fix all icons to take in different fill colors.
  // Currently this only works for certain icons, like the globe
  // This means this variant might not work for most icons.
  variant?: "dark" | "light";
};

export const PouvoirFigureL = ({
  valeur,
  intitule,
  annee,
  evolution,
  withChart,
  withButtons,
  icon,
  chartClassName,
  variant = "light",
}: PouvoirFigureLProps) => {
  const anneeAffichee = annee;
  const pourcentageFormate = valeur.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-9 items-center">
      {withChart && (
        <DoughnutChart
          value={valeur}
          className={cn("w-28 h-28 shrink-0", chartClassName)}
          variant={variant}
          icon={icon}
        />
      )}
      <div
        className={cn(
          "flex justify-center",
          withChart ? "flex-col" : "flex-col lg:flex-row items-center gap-4",
        )}
      >
        <div className="flex flex-row  items-start gap-2">
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
      {withButtons && <LiensCTA />}
    </div>
  );
};

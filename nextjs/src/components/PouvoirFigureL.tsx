import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";
import { DoughnutChart } from "./charts/DoughnutChart";
import { EvolutionBadge } from "./EvolutionBadge";
import { LiensCTA } from "./LiensCTA";

export type PouvoirFigureLProps = {
  valeur: number | null;
  /** Affiché en majuscules, e.g. "présidant une région" */
  intitule: React.ReactNode;
  annee: number;
  evolution?: number | null;
  withChart?: boolean;
  withButtons?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  chartClassName?: string;

  // TODO: fix all icons to take in different fill colors.
  // Currently this only works for certain icons, like the globe
  // This means this variant might not work for most icons.
  variant?: "dark" | "light";
  downloadURL?: string;
};

export const PouvoirFigureL = ({
  valeur,
  intitule,
  annee,
  evolution,
  withChart,
  withButtons,
  downloadURL,
  icon,
  chartClassName,
  variant = "light",
}: PouvoirFigureLProps) => {
  const anneeAffichee = annee;
  // Check if valeur is not null if it's the case show '--' instead of 0%
  let pourcentageFormate = "--";
  if (valeur !== null) {
    pourcentageFormate = valeur.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-9 items-center">
      {withChart && (
        <DoughnutChart
          value={valeur !== null ? valeur : 0}
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
          {evolution !== undefined && (
            <EvolutionBadge
              value={evolution}
              display_a_venir={valeur === null}
            />
          )}
        </div>
        <div className="flex flex-col text-foundations-violet-principal">
          <span className="text-femmes-l">de femmes</span>
          <span className="text-intitule-l">{intitule}</span>
          <span className="text-intitule-m">en {anneeAffichee}</span>
        </div>
      </div>
      {withButtons && <LiensCTA downloadURL={downloadURL} />}
    </div>
  );
};

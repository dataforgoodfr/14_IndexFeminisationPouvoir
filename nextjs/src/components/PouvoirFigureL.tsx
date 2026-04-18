import { cn } from "@/lib/utils";
import { DoughnutChart } from "./charts/DoughnutChart";
import { EvolutionBadge } from "./EvolutionBadge";

export type PouvoirFigureLProps = {
  valeur: number;
  /** Affiché en majuscules, e.g. "présidant une région" */
  intitule: string;
  annee?: number;
  evolution?: number;
  withChart?: boolean;
};

export const PouvoirFigureL = ({
  valeur,
  intitule,
  annee,
  evolution,
  withChart,
}: PouvoirFigureLProps) => {
  const anneeAffichee = annee ?? new Date().getFullYear();
  const pourcentageFormate = valeur.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <div className="flex flex-row gap-9 items-center">
      {withChart && (
        <DoughnutChart
          value={valeur}
          className="w-28 h-28 shrink-0"
          variant="light"
        />
      )}
      <div
        className={cn(
          "flex justify-center",
          withChart ? "flex-col " : "flex-row items-center gap-4",
        )}
      >
        <div className="flex flex-row items-start gap-2">
          <span className="text-chiffre-l text-foundations-violet-principal leading-none">
            {pourcentageFormate}%
          </span>
          {evolution !== undefined && <EvolutionBadge value={evolution} />}
        </div>
        <div className="flex flex-col text-foundations-violet-principal">
          <span className="md:text-femmes-xl text-femmes-s lowercase">
            de femmes
          </span>
          <span className="md:header-h3 header-h4 uppercase">{intitule}</span>
          <span className="md:header-h3 header-h4 uppercase">
            en {anneeAffichee}
          </span>
        </div>
      </div>
    </div>
  );
};

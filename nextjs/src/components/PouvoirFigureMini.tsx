import { DoughnutChart } from "./charts/DoughnutChart";

type EvolutionBadgeProps = { value: number };
const EvolutionBadge = ({ value }: EvolutionBadgeProps) => {
  const label = `${value > 0 ? "+" : ""}${value}%`;
  const colorClass =
    value >= 0
      ? "bg-foundations-vert-principal"
      : "bg-foundations-rouge-principal";
  return (
    <span
      className={`${colorClass} text-white text-xs font-bold px-2 py-0.5 rounded`}
    >
      {label}
    </span>
  );
};

export type PouvoirFigureMiniProps = {
  valeur: number;
  /** Affiché en majuscules, e.g. "présidant une région" */
  role: string;
  annee?: number;
  evolution?: number;
};

export const PouvoirFigureMini = ({
  valeur,
  role,
  annee,
  evolution,
}: PouvoirFigureMiniProps) => {
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
};

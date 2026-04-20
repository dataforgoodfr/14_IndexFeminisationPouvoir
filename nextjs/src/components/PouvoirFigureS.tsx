import { EvolutionBadge } from "./EvolutionBadge";
import { FemmeIcon } from "./icons/femme";

export type PouvoirFigureSProps = {
  valeur: number;
  /** Affiché en majuscules, e.g. "présidant une région" */
  intitule: string;
  annee?: number;
  evolution?: number;
};

export const PouvoirFigureS = ({
  valeur,
  intitule,
  annee,
  evolution,
}: PouvoirFigureSProps) => {
  const anneeAffichee = annee ?? new Date().getFullYear();
  const pourcentageFormate = valeur.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <div className="flex flex-row gap-3 items-start">
      <div className="w-6">
        <FemmeIcon />
      </div>
      <div className="flex-auto flex justify-center flex-col max-w-45">
        <div className="flex flex-row items-start gap-2">
          <span className="text-chiffre-s text-foundations-violet-principal leading-none">
            {pourcentageFormate}%
          </span>
          {evolution !== undefined && <EvolutionBadge value={evolution} />}
        </div>
        <div className="flex flex-col text-foundations-violet-principal">
          <span className="text-femmes-s">de femmes</span>
          <span className="text-intitule-s">{intitule}</span>
          <span className="text-intitule-xs">en {anneeAffichee}</span>
        </div>
      </div>
    </div>
  );
};

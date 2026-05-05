import { EvolutionBadge } from "./EvolutionBadge";
import { FemmeIcon } from "./icons/femme";

export type PouvoirFigureSProps = {
  valeur: number | null;
  /** Affiché en majuscules, e.g. "présidant une région" */
  intitule: string;
  annee: number;
  evolution?: number | null;
  hidePercentage?: boolean;
  textFemmes?: string;
};

export const PouvoirFigureS = ({
  valeur,
  intitule,
  annee,
  evolution,
  hidePercentage,
  textFemmes = "de femmes",
}: PouvoirFigureSProps) => {
  const anneeAffichee = annee;
  let pourcentageFormate = "--";
  if (valeur !== null) {
    pourcentageFormate = valeur.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
  }

  return (
    <div className="flex flex-row gap-3 items-start">
      <div className="w-6 shrink-0">
        <FemmeIcon />
      </div>
      <div className="flex-auto flex justify-center flex-col max-w-60 lg:max-w-45">
        <div className="flex flex-row items-start gap-2">
          <span className="text-chiffre-s text-foundations-violet-principal leading-none">
            {pourcentageFormate}
            {!hidePercentage && "%"}
          </span>
          {evolution !== undefined && (
            <EvolutionBadge
              value={evolution}
              display_a_venir={valeur === null}
            />
          )}
        </div>
        <div className="flex flex-col text-foundations-violet-principal">
          <span className="text-femmes-s">{textFemmes}</span>
          <span className="text-intitule-s">{intitule}</span>
          <span className="text-intitule-xs">en {anneeAffichee}</span>
        </div>
      </div>
    </div>
  );
};

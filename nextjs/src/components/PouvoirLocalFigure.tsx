import { EvolutionBadge } from "./EvolutionBadge";
import { PresidenteDeptIcon } from "./icons/presidente-departement";
import { PresidenteRegionIcon } from "./icons/presidente-region";

export type PouvoirLocalFigureProps = {
  valeur: number;
  /** Affiché en majuscules, e.g. "présidant une région" */
  intitule: string;
  intitule2?: string;
  annee?: number;
  evolution?: number;
  IconType?: "region" | "departement";
};

export const PouvoirLocalFigure = ({
  valeur,
  intitule,
  intitule2,
  annee,
  evolution,
  IconType,
}: PouvoirLocalFigureProps) => {
  const anneeAffichee = annee ?? new Date().getFullYear();
  const pourcentageFormate = valeur.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <div className="flex flex-row gap-9 items-center">
      {IconType === "region" && <PresidenteRegionIcon className="size-40" />}
      {IconType === "departement" && <PresidenteDeptIcon className="size-40" />}
      <div className="flex justify-center flex-col">
        <div className="flex flex-row items-start gap-2">
          <span className="text-chiffre-l text-foundations-violet-principal leading-none">
            {pourcentageFormate}%
          </span>
          {evolution !== undefined && <EvolutionBadge value={evolution} />}
        </div>
        <div className="flex flex-col text-foundations-violet-principal">
          <span className="text-femmes-xl  lowercase">de femmes</span>
          <span className="header-h3  uppercase">{intitule}</span>
          {intitule2 && (
            <span className="header-h3  uppercase">{intitule2}</span>
          )}
          <span className="header-h3  uppercase">en {anneeAffichee}</span>
        </div>
      </div>
    </div>
  );
};

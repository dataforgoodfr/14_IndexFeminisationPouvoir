import { EvolutionBadge } from "./EvolutionBadge";
import { PresidenteDeptIcon } from "./icons/presidente-departement";
import { PresidenteRegionIcon } from "./icons/presidente-region";

export type PouvoirLocalFigureProps = {
  valeur: number | null;
  /** Affiché en majuscules, e.g. "présidant une région" */
  intitule: string;
  prelabel?: string;
  annee: number;
  evolution?: number | null;
  IconType?: "region" | "departement";
};

export const PouvoirLocalFigure = ({
  valeur,
  intitule,
  prelabel,
  annee,
  evolution,
  IconType,
}: PouvoirLocalFigureProps) => {
  const pourcentageFormate =
    valeur !== null
      ? valeur.toLocaleString("fr-FR", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        })
      : "--";

  return (
    <div className="flex flex-row gap-9 items-center">
      {IconType === "region" && <PresidenteRegionIcon className="size-40" />}
      {IconType === "departement" && <PresidenteDeptIcon className="size-40" />}
      <div className="flex justify-center flex-col">
        <div className="flex flex-row items-start gap-2">
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
          <span className="text-femmes-xl  lowercase">de femmes</span>
          {prelabel && <span className="header-h3  uppercase">{prelabel}</span>}
          <span className="header-h3  uppercase">{intitule}</span>
          <span className="header-h3  uppercase">en {annee}</span>
        </div>
      </div>
    </div>
  );
};

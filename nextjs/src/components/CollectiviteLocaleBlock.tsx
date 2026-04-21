import { Block } from "./Block";
import { PouvoirFigureL } from "./PouvoirFigureL";

export type StatConfig = {
  valeur: number;
  evolution?: number;
  role: string;
  annee?: number;
};

type CollectiviteLocaleBlockProps = {
  /** Affiché dans le badge titre, e.g. "Régions", "Départements", "Communes" */
  titre: string;
  stats: StatConfig[];
  dateMiseAJour?: Date;
};

export const CollectiviteLocaleBlock = ({
  titre,
  stats,
  dateMiseAJour,
}: CollectiviteLocaleBlockProps) => {
  return (
    <Block titre={titre} dateMiseAJour={dateMiseAJour}>
      {stats.map((stat) => (
        <div
          key={stat.role}
          className={
            "border-b border-dashed border-purple-oxfam-300 py-6 last:border-b-0"
          }
        >
          <PouvoirFigureL
            valeur={stat.valeur}
            intitule={stat.role}
            annee={stat.annee}
            evolution={stat.evolution}
            withChart
          />
        </div>
      ))}
    </Block>
  );
};

import { PouvoirFigureMini } from "./PouvoirFigureMini";

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
    <div className="relative pt-5 pb-2">
      {/* Badge titre — chevauche le bord supérieur de la carte */}
      <div className="absolute top-0 left-4 -translate-y-1/2 z-10 bg-purple-oxfam-600 rounded-md px-10 py-2">
        <span className="header-h3 text-white">{titre}</span>
      </div>

      {/* Carte bordée */}
      <div className="bg-white border-2 border-purple-oxfam-100 px-16 pt-12 pb-8">
        {stats.map((stat, i) => (
          <div key={`${stat.role}-${i}`}>
            {i > 0 && (
              <div className="border-t border-dashed border-purple-oxfam-300 my-5" />
            )}
            <PouvoirFigureMini
              valeur={stat.valeur}
              role={stat.role}
              annee={stat.annee}
              evolution={stat.evolution}
            />
          </div>
        ))}
      </div>

      {/* Date de mise à jour — sous la carte, alignée à droite */}
      {dateMiseAJour && (
        <p className="text-right text-xs text-purple-oxfam-600 mt-1">
          Dernière mise à jour :{" "}
          {dateMiseAJour.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
};

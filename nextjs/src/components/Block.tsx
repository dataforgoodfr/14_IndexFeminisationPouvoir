import { cn } from "@/lib/utils";

type BlockProps = {
  titre: string;
  dateMiseAJour?: Date;
  children: React.ReactNode;
  /** Classes supplémentaires sur le conteneur externe (ex. `flex-1 min-w-0`) */
  className?: string;
  /** Classes supplémentaires sur la carte intérieure (padding, height…) */
  cardClassName?: string;
};

export const Block = ({
  titre,
  dateMiseAJour,
  children,
  className,
  cardClassName,
}: BlockProps) => (
  <div className={cn("relative pt-5 pb-2", className)}>
    {/* Badge titre centré sur la bordure supérieure de la carte */}
    <div className="absolute top-0 left-4 -translate-y-1/2 z-10 bg-foundations-violet-principal rounded-md px-10 py-2">
      <span className="header-h3 text-white">{titre}</span>
    </div>

    {/* Carte bordée */}
    <div
      className={cn("bg-white border-2 border-purple-oxfam-100", cardClassName)}
    >
      {children}
    </div>

    {/* Date de mise à jour — sous la carte, alignée à droite */}
    {dateMiseAJour && (
      <p className="text-right text-xs text-foundations-violet-principal mt-1">
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

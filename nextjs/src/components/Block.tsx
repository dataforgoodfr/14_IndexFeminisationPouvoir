import { cn } from "@/lib/utils";
import { ShortDate } from "./ShortDate";

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
    <div className="absolute min-w-40 text-center top-8 -left-4 z-10 bg-foundations-violet-principal rounded-md px-6 py-2">
      <span className="header-h3 text-white">{titre}</span>
    </div>

    {/* Carte bordée */}
    <div
      className={cn(
        "bg-white border-2 border-purple-oxfam-100 px-16 py-4 pt-12",
        cardClassName,
      )}
    >
      {children}
    </div>

    {/* Date de mise à jour — sous la carte, alignée à droite */}
    {dateMiseAJour && (
      <p className="text-right text-xs text-foundations-violet-principal mt-1">
        Dernière mise à jour : <ShortDate date={new Date(dateMiseAJour)} />
      </p>
    )}
  </div>
);

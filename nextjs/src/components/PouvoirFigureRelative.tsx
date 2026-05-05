import { EvolutionBadge } from "./EvolutionBadge";

export const PouvoirFigureRelative = ({
  femmes,
  total,
  intitule,
  annee,
  evolution,
}: {
  femmes: number;
  total: number;
  intitule: React.ReactNode;
  annee: number;
  evolution: number;
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 items-center lg:items-start">
      <div className="flex flex-row gap-2">
        <span className="text-chiffre-l text-foundations-violet-principal leading-none">
          {femmes}/{total}
        </span>
        <EvolutionBadge value={evolution} />
      </div>
      <div className="flex flex-col text-center lg:text-left text-foundations-violet-principal">
        <span className="text-femmes-xl lowercase">femmes</span>
        <span className="header-h3 uppercase">{intitule}</span>
        <span className="header-h3 uppercase">en {annee}</span>
      </div>
    </div>
  );
};

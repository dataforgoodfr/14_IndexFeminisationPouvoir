import { DoughhnutChart } from "./charts/DoughnutChart";
import { PouvoirLocalIcon } from './icons/pouvoir-local';

export type PouvoirFigureMiniProps = {
  valeur: number;
  texte: React.ReactNode;
  subtexte: React.ReactNode;
};
export const PouvoirFigureMini = ({
  valeur,
  texte,
  subtexte,
}: PouvoirFigureMiniProps) => (
  <div className="flex flex-col  lg:flex-row gap-9">
    <DoughhnutChart value={valeur} className="w-32 h-32" icon={PouvoirLocalIcon} />
    <div className="flex flex-col justify-center">
      <span className="text-chiffre-xl text-foundations-violet">
        {valeur.toFixed(2)} %
      </span>
      <span className="text-femmes-xl text-foundations-violet">{texte}</span>
      <span className="text-femmes-xl text-foundations-violet">{subtexte}</span>
    </div>
  </div>
);

import { FemmeIcon } from "./icons/femme";
import { HommeIcon } from "./icons/homme";

type PersonGridProps = {
  femmes: number;
  hommes: number;
};

export const PersonGrid = ({ femmes, hommes }: PersonGridProps) => (
  <div className="flex gap-1.5 items-end">
    {Array.from({ length: femmes }, (_, i) => (
      <FemmeIcon key={`f-${i}`} className="w-6 h-14" />
    ))}
    {Array.from({ length: hommes }, (_, i) => (
      <HommeIcon key={`m-${i}`} className="w-6 h-14" />
    ))}
  </div>
);

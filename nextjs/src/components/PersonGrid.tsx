import { FemmeIcon } from "./icons/femme";
import { HommeIcon } from "./icons/homme";

type PersonGridProps = {
  femmes: number;
  hommes: number;
};

export const PersonGrid = ({ femmes, hommes }: PersonGridProps) => (
  <div className="flex gap-6 items-end" aria-hidden="true">
    {Array.from({ length: femmes }, (_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static list from count, never reordered
      <FemmeIcon key={`f-${i}`} className="w-6 h-14" />
    ))}
    {Array.from({ length: hommes }, (_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static list from count, never reordered
      <HommeIcon key={`m-${i}`} className="w-6 h-14" />
    ))}
  </div>
);

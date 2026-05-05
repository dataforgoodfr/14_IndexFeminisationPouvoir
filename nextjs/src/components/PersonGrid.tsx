import { cn } from "@/lib/utils";
import { FemmeIcon } from "./icons/femme";
import { HommeIcon } from "./icons/homme";

type PersonGridProps = {
  femmes: number;
  hommes: number;
  className?: string;
};

export const PersonGrid = ({ femmes, hommes, className }: PersonGridProps) => (
  <div
    className={cn(
      "flex flex-wrap lg:flex-nowrap gap-6 items-end justify-center lg:justify-start",
      className,
    )}
    aria-hidden="true"
  >
    {Array.from({ length: femmes }, (_, i) => (
      <FemmeIcon
        // biome-ignore lint/suspicious/noArrayIndexKey: static list from count, never reordered
        key={`f-${i}`}
        className="w-6 h-14 fill-foundations-violet-clair"
      />
    ))}
    {Array.from({ length: hommes }, (_, i) => (
      <HommeIcon
        // biome-ignore lint/suspicious/noArrayIndexKey: static list from count, never reordered
        key={`m-${i}`}
        className="w-6 h-14 fill-foundations-violet-tres-clair"
      />
    ))}
  </div>
);

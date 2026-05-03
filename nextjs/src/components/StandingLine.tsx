import { SearchIcon } from "@/components/icons/search";
import { ThumbUpIcon } from "@/components/icons/thumbup";
import { cn } from "@/lib/utils";
import { EvolutionBadge } from "./EvolutionBadge";

interface StandingLineProps {
  rank: number;
  label: string;
  percentage: number;
  evolution?: number;
  iconType?: "up" | "down" | "none";
  showSearch?: boolean;
}

export const StandingLine: React.FC<StandingLineProps> = ({
  rank,
  label,
  percentage,
  evolution,
  iconType = "none",
  showSearch = false,
}) => {
  let backgroundColor = "bg-foundations-violet-tres-clair";
  if (rank % 2 === 1) {
    backgroundColor = "bg-foundations-blanc";
  }

  return (
    <div
      className={`flex flex-row items-center gap-x-2 lg:gap-x-5 px-2.5 py-1.25 ${backgroundColor}`}
    >
      {/* Icon */}
      {iconType === "up" ? (
        <div className="flex-1">
          <ThumbUpIcon className="w-5 h-5 fill-foundations-vert-principal" />
        </div>
      ) : iconType === "down" ? (
        <div className="flex-1">
          <ThumbUpIcon className="w-5 h-5 rotate-180 fill-foundations-rouge-principal" />
        </div>
      ) : (
        <div className="w-1" />
      )}

      {/* Label */}
      <div className="flex-9">
        <p className="body1-medium text-foundations-noir">
          {rank}. {label}
        </p>
      </div>

      {/* Percentage */}
      <div className="flex-1">
        <p className="body1-medium text-right text-foundations-violet-principal">
          {percentage}%
        </p>
      </div>

      {/* Evolution */}
      {evolution !== undefined && (
        <EvolutionBadge value={evolution} className="flex-3" />
      )}
      <div
        className={cn("flex-1 flex justify-end", showSearch ? "" : "hidden")}
      >
        <button type="button" className="cursor-pointer">
          <SearchIcon className="w-5 h-5 fill-foundations-violet-principal" />
        </button>
      </div>
    </div>
  );
};

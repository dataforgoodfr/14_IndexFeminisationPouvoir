import { SearchIcon } from "@/components/icons/search";
import { ThumbDownIcon } from "@/components/icons/thumbdown";
import { ThumbUpIcon } from "@/components/icons/thumbup";

interface StandingLineProps {
  rank: number;
  regionName: string;
  percentage: number;
  evolution: number;
  iconType?: "up" | "down" | "none";
}

export const StandingLine: React.FC<StandingLineProps> = ({
  rank,
  regionName,
  percentage,
  evolution,
  iconType = "none",
}) => {
  const isEvolutionPositive = evolution > 0;
  let bgEvolution = "bg-evolution-red";
  if (isEvolutionPositive) {
    bgEvolution = "bg-evolution-green";
  }
  let backgroundColor = "bg-foundations-violet-tres-clair";
  if (rank % 2 === 1) {
    backgroundColor = "bg-foundations-blanc";
  }

  return (
    <div
      className={`flex flex-row items-center gap-x-[20px] px-[10px] py-[5px] ${backgroundColor}`}
    >
      {/* Icon */}
      <div className="flex-1">
        {iconType === "up" && (
          <ThumbUpIcon
            className="w-5 h-5"
            fill="var(--color-foundations-vert-principal)"
          />
        )}
        {iconType === "down" && (
          <ThumbDownIcon
            className="w-5 h-5"
            fill="var(--color-foundations-rouge-principal)"
          />
        )}
      </div>

      {/* Region Name */}
      <div className="flex-9">
        <p className="body1-medium text-foundations-noir">
          {rank}. {regionName}
        </p>
      </div>

      {/* Percentage */}
      <div className="flex-1">
        <p className="body1-medium text-right text-foundations-violet-principal">
          {percentage}%
        </p>
      </div>

      {/* Evolution */}
      <div className={`flex-2 flex justify-center ${bgEvolution}`}>
        <p className="label-medium text-foundations-blanc">
          {evolution > 0 ? "+" : ""}
          {evolution}%
        </p>
      </div>
      <div className="flex-1 flex justify-end">
        <button type="button" className="cursor-pointer">
          <SearchIcon
            className="w-5 h-5"
            fill="var(--color-foundations-violet-principal)"
          />
        </button>
      </div>
    </div>
  );
};

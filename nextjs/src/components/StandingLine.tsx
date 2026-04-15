import { SearchIcon } from "@/components/icons/search";
import { ThumbUpIcon } from "@/components/icons/thumbup";

interface StandingLineProps {
  rank: number;
  label: string;
  percentage: number;
  evolution?: number;
  iconType?: "up" | "down" | "none";
}

export const StandingLine: React.FC<StandingLineProps> = ({
  rank,
  label,
  percentage,
  evolution,
  iconType = "none",
}) => {
  let backgroundColor = "bg-foundations-violet-tres-clair";
  if (rank % 2 === 1) {
    backgroundColor = "bg-foundations-blanc";
  }

  return (
    <div
      className={`flex flex-row items-center gap-x-5 px-2.5 py-1.25 ${backgroundColor}`}
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
          <ThumbUpIcon
            className="w-5 h-5 rotate-180"
            fill="var(--color-foundations-rouge-principal)"
          />
        )}
      </div>

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
        <div
          className={`flex-2 flex justify-center ${evolution > 0 ? "bg-evolution-green" : "bg-evolution-red"}`}
        >
          <p className="label-medium text-foundations-blanc">
            {evolution > 0 ? "+" : ""}
            {evolution}%
          </p>
        </div>
      )}
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

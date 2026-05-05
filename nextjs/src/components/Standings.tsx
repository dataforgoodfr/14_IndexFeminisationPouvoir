import { StandingLine } from "./StandingLine";

interface StandingData {
  label: string;
  percentage: number | null;
  evolution?: number | null;
}

interface StandingsProps {
  data: StandingData[];
  order?: "ascending" | "descending";
  thumbsUpTop?: number;
  thumbsDownBottom?: number;
  showSearch?: boolean;
}

export const Standings: React.FC<StandingsProps> = ({
  data,
  order = "descending",
  thumbsDownBottom = 0,
  thumbsUpTop = 0,
  showSearch = false,
}) => {
  // Sort data by percentage
  const sortedData = data.toSorted((a, b) => {
    if (b.percentage === null) return -1;
    if (a.percentage === null) return 1;
    return b.percentage - a.percentage;
  });

  if (order === "ascending") {
    sortedData.reverse();
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <div>
        {sortedData.map((item, index) => (
          <StandingLine
            key={item.label}
            rank={index + 1}
            label={item.label}
            percentage={item.percentage}
            evolution={item.evolution}
            iconType={
              index < thumbsUpTop
                ? "up"
                : index >= sortedData.length - thumbsDownBottom
                  ? "down"
                  : "none"
            }
            showSearch={showSearch}
          />
        ))}
      </div>
    </div>
  );
};

import { StandingLine } from "./StandingLine";

interface StandingData {
  regionName: string;
  percentage: number;
  evolution: number;
}

interface StandingsProps {
  data: StandingData[];
}

export const Standings: React.FC<StandingsProps> = ({ data }) => {
  // Sort data by percentage in descending order
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="flex flex-col overflow-hidden">
      <div>
        {sortedData.map((item, index) => (
          <StandingLine
            key={item.regionName}
            rank={index + 1}
            regionName={item.regionName}
            percentage={item.percentage}
            evolution={item.evolution}
            iconType={
              index + 1 <= 5
                ? "up"
                : index + 1 >= sortedData.length - 4
                  ? "down"
                  : "none"
            }
          />
        ))}
      </div>
    </div>
  );
};

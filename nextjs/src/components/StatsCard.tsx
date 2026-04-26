import { EvolutionBadge } from "./EvolutionBadge";

type StatsCardProps = {
  label: string;
  score: number;
  evolution: number;
};

export function StatsCard({ label, score, evolution }: StatsCardProps) {
  return (
    <div className="bg-white border border-[#dde1e6] w-40 lg:w-50 p-4 flex flex-col gap-1 shrink-0">
      <p className="body1-medium text-foundations-violet-principal max-w-16 lg:max-w-full">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p
          className="leading-[1.1] not-italic shrink-0"
          style={{
            fontFamily: "var(--font-oxfam-tstar-pro)",
            fontSize: "34px",
            color: "var(--color-purple-oxfam-400, #8b72be)",
          }}
        >
          {score.toFixed(1)}%
        </p>
        <EvolutionBadge value={evolution} />
      </div>
    </div>
  );
}

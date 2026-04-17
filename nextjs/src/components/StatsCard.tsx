type StatsCardProps = {
  label: string;
  score: number;
  evolution: number;
};

export function StatsCard({ label, score, evolution }: StatsCardProps) {
  const isPositive = evolution >= 0;
  return (
    <div className="bg-white border border-[#dde1e6] rounded-[6px] p-4 flex flex-col gap-[5px] shrink-0">
      <p className="body1-medium text-foundations-violet-principal whitespace-nowrap">
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
        <span
          className={`label-medium px-2 py-0.5 rounded-sm text-white ${isPositive ? "bg-foundations-vert-principal" : "bg-foundations-rouge-principal"}`}
        >
          {isPositive ? "+" : ""}
          {evolution}%
        </span>
      </div>
    </div>
  );
}

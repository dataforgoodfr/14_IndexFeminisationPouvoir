type EvolutionBadgeProps = { value: number };
export const EvolutionBadge = ({ value }: EvolutionBadgeProps) => {
  const label = `${value > 0 ? "+" : ""}${value}%`;
  const colorClass =
    value >= 0
      ? "bg-foundations-vert-principal"
      : "bg-foundations-rouge-principal";
  return (
    <span
      className={`${colorClass} text-white text-xs font-bold px-2 py-0.5 rounded`}
    >
      {label}
    </span>
  );
};

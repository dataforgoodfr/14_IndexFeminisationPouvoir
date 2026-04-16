import { cn } from "@/lib/utils";

type EvolutionBadgeProps = { value: number; className?: string };
export const EvolutionBadge = ({ value, className }: EvolutionBadgeProps) => (
  <div
    className={cn(
      value > 0 ? "bg-evolution-green" : "bg-evolution-red",
      className,
    )}
  >
    <p className="label-medium text-foundations-blanc">
      {value > 0 ? "+" : ""}
      {value}%
    </p>
  </div>
);

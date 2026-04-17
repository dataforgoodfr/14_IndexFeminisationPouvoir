import { cn } from "@/lib/utils";

type EvolutionBadgeProps = { value: number; className?: string };
export const EvolutionBadge = ({ value, className }: EvolutionBadgeProps) => (
  <div
    className={cn(
      "svg-bg",
      value > 0 ? "svg-evolution-green" : "svg-evolution-red",
      className,
      "z-1!",
    )}
  >
    <p className="label-medium text-foundations-blanc">
      {value > 0 ? "+" : ""}
      {value}%
    </p>
  </div>
);

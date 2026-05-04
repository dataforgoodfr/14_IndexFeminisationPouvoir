import { cn } from "@/lib/utils";

type EvolutionBadgeProps = {
  value: number | null;
  display_a_venir?: boolean;
  className?: string;
};
export const EvolutionBadge = ({
  value,
  display_a_venir = false,
  className,
}: EvolutionBadgeProps) => {
  if (value == null && !display_a_venir) {
    return null;
  }

  return (
    <div
      title="Taux d'évolution depuis l'année précédente"
      className={cn(
        "svg-bg",
        display_a_venir
          ? "svg-evolution-green"
          : value !== null
            ? value > 0
              ? "svg-evolution-green"
              : "svg-evolution-red"
            : "svg-evolution-red",
        className,
        "z-1!",
      )}
    >
      <p
        className={cn(
          "label-medium text-foundations-blanc",
          display_a_venir && "pb-[1px]",
        )}
      >
        {display_a_venir
          ? "à venir"
          : value !== null
            ? value > 0
              ? "+"
              : ""
            : ""}
        {display_a_venir ? "" : value !== null ? value : ""}{" "}
        {display_a_venir ? "" : "%"}
      </p>
    </div>
  );
};

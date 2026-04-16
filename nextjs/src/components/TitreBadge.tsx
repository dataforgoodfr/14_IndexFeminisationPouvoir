import { cn } from "@/lib/utils";

export const TitreBadge = ({
  titre,
  className,
}: {
  titre: string;
  className?: string;
}) => (
  <div
    className={cn(
      `bg-foundations-violet-principal rounded-md px-4 py-2 text-center`,
      className,
    )}
  >
    <span className="header-h3 text-white">{titre}</span>
  </div>
);

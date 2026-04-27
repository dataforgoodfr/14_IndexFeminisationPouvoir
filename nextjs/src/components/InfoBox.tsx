import { cn } from "@/lib/utils";
import { InfoIcon } from "./icons/info";

type InfoBoxProps = {
  children: React.ReactNode;
  className?: string;
};

export const InfoBox = ({ children, className }: InfoBoxProps) => {
  return (
    <div
      className={cn(
        `flex flex-row items-start gap-4 bg-foundations-violet-tres-clair p-5`,
        className,
      )}
    >
      <InfoIcon className="w-12 h-12 shrink-0" />
      <div>{children}</div>
    </div>
  );
};

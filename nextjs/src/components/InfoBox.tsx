import { cn } from "@/lib/utils";
import { InfoIcon } from "./icons/info";

type InfoBoxProps = {
  children: React.ReactNode;
  className?: string;
  classes?: {
    icon?: string;
  };
};

export const InfoBox = ({ children, className, classes }: InfoBoxProps) => {
  return (
    <div
      className={cn(
        `flex flex-row items-start gap-4 bg-foundations-violet-tres-clair p-5`,
        className,
      )}
    >
      <InfoIcon className={cn("w-12 h-12 shrink-0", classes?.icon)} />
      <div>{children}</div>
    </div>
  );
};

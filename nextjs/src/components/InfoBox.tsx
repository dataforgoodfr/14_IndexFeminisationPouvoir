import { InfoIcon } from "./icons/info";

type InfoBoxProps = {
  children: React.ReactNode;
};

export const InfoBox = ({ children }: InfoBoxProps) => {
  return (
    <div className="flex items-start gap-4 bg-foundations-violet-tres-clair p-5">
      <InfoIcon className="w-12 h-12 shrink-0" />
      <div>{children}</div>
    </div>
  );
};

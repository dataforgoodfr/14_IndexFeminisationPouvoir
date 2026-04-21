import type { SVGProps } from "react";

type JuridictionCardProps = {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
};

export const JuridictionCard = ({
  icon: Icon,
  label,
}: JuridictionCardProps) => (
  <div className="bg-foundations-violet-clair flex flex-col items-center justify-center gap-5 pt-9 pb-12 px-3.5 flex-1 min-w-0">
    <Icon className="w-[75px] h-[75px]" />
    <p className="header-h4 text-center whitespace-pre-line">{label}</p>
  </div>
);

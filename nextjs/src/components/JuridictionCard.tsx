import type { SVGProps } from "react";

type JuridictionCardProps = {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  description: string;
};

export const JuridictionCard = ({
  icon: Icon,
  label,
  description,
}: JuridictionCardProps) => (
  <div
    title={description}
    className="bg-foundations-violet-clair flex flex-col items-center justify-center gap-5 pt-9 pb-12 px-3.5 flex-1 min-w-0"
  >
    <Icon className="w-18.75 h-18.75" />
    <p className="header-h4 text-center whitespace-pre-line">{label}</p>
  </div>
);

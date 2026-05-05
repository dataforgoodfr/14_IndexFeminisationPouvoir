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
  <button
    type="button"
    className="group relative bg-foundations-violet-clair flex flex-col items-center justify-center gap-5 pt-9 pb-12 px-3.5 flex-1 min-w-0"
  >
    <Icon className="w-18.75 h-18.75" />
    <p className="header-h4 text-center whitespace-pre-line">{label}</p>
    <span className="invisible group-hover:visible group-focus:visible group-focus-within:visible flex z-5 px-5 py-5 absolute top-0 bg-foundations-violet-principal w-full h-full body3-medium text-center justify-center items-center text-foundations-blanc">
      <p className="">{description}</p>
    </span>
  </button>
);

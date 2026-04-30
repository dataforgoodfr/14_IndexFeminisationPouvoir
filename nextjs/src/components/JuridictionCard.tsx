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
    // title={description}
    className="group relative bg-foundations-violet-clair flex flex-col items-center justify-center gap-5 pt-9 pb-12 px-3.5 flex-1 min-w-0"
  >
    <Icon className="w-18.75 h-18.75" />
    <p className="header-h4 text-center whitespace-pre-line">{label}</p>
    <span className="invisible group-hover:visible z-50 shadow-lg px-3 py-2 absolute top-full mt-1 bg-foundations-violet-clair w-[calc(100%+20px)] body2-regular text-center">
      <p className="">{description}</p>
    </span>
  </div>
);

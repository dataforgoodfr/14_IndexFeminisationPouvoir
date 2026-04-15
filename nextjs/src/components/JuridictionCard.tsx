type JuridictionCardProps = {
  name: string;
  icon?: React.ReactNode;
};

export const JuridictionCard = ({ name, icon }: JuridictionCardProps) => (
  <div className="bg-foundations-violet-clair flex flex-col items-center justify-center gap-5 py-9 px-3.5 w-44 h-55">
    {icon && (
      <div className="flex items-center justify-center h-19 w-19">{icon}</div>
    )}
    <h4 className="header-h4 text-center">{name}</h4>
  </div>
);

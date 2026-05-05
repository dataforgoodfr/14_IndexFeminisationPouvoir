type BlocMethodoProps = {
  title: string;
  icon: React.ReactNode;
  description: React.ReactNode;
  order: number;
};
export const BlocMethodo = ({
  title,
  icon,
  description,
  order,
}: BlocMethodoProps) => (
  <div className="flex flex-row items-center gap-4 p-4 border border-gray-200">
    {icon}
    <div className="flex flex-col">
      <h3 className="header-h3">
        Étape {order} : {title}
      </h3>
      <p className="body1-medium text-foundations-gris-fonce">{description}</p>
    </div>
  </div>
);

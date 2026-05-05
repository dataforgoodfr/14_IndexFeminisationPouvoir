type BlocMethodoProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};
export const BlocMethodo = ({ title, icon, children }: BlocMethodoProps) => (
  <div className="flex flex-row items-start gap-4 p-4 border border-gray-200">
    {icon}
    <div className="flex flex-col">
      <h3 className="header-h3">{title}</h3>
      {children}
    </div>
  </div>
);

type TitleProps = {
  id: string;
  title: string;
  subtitle?: string;
};

export const PageTitle = ({ id, title, subtitle }: TitleProps) => (
  <div className="flex flex-col gap-2.5 items-center">
    <h1
      id={id}
      className="header-h1 text-foundations-violet-principal text-center"
    >
      {title}
    </h1>
    <div className="divider" />
    {subtitle && (
      <span className="text-md text-center text-black max-w-[620px]">
        {subtitle}
      </span>
    )}
  </div>
);

export const SectionTitle = ({ id, title, subtitle }: TitleProps) => (
  <div className="flex flex-col gap-2.5 items-center">
    <h2
      id={id}
      className="header-h2 text-foundations-violet-principal text-center"
    >
      {title}
    </h2>
    <div className="divider" />
    {subtitle && (
      <span className="text-lg text-center text-black">{subtitle}</span>
    )}
  </div>
);

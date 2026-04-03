type PageTitleProps = {
  title: string;
  subtitle?: string;
};
export const PageTitle = ({ title, subtitle }: PageTitleProps) => (
  <div className="flex flex-col gap-2.5 items-center">
    <h1 className="text-4xl text-center">{title}</h1>
    <div className="rounded bg-foundations-violet-clair h-1.5 w-15" />
    {subtitle && (
      <span className="text-lg text-center text-black">{subtitle}</span>
    )}
  </div>
);

import { cn } from "@/lib/utils";

type TitleProps = {
  id: string;
  title: string;
  subtitle?: string;
  classes?: {
    root?: string;
    title?: string;
    divider?: string;
    subtitle?: string;
  };
};

export const PageTitle = ({ id, title, subtitle, classes }: TitleProps) => (
  <div className={cn("flex flex-col gap-2.5 items-center", classes?.root)}>
    <h1
      id={id}
      className={cn(
        "header-h1 text-foundations-violet-principal text-center",
        classes?.title,
      )}
    >
      {title}
    </h1>
    <div className={cn("divider", classes?.divider)} />
    {subtitle && (
      <span
        className={cn(
          "text-lg text-center text-black max-w-2xl p-4",
          classes?.subtitle,
        )}
      >
        {subtitle}
      </span>
    )}
  </div>
);

export const SectionTitle = ({ id, title, subtitle, classes }: TitleProps) => (
  <div className={cn("flex flex-col gap-2.5 items-center", classes?.root)}>
    <h2
      id={id}
      className={cn(
        "header-h2 text-foundations-violet-principal text-center",
        classes?.title,
      )}
    >
      {title}
    </h2>
    <div className={cn("divider", classes?.divider)} />
    {subtitle && (
      <span className={cn("text-lg text-center text-black", classes?.subtitle)}>
        {subtitle}
      </span>
    )}
  </div>
);

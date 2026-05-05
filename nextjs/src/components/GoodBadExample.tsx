import { cn } from "@/lib/utils";
import { ThumbUpIcon } from "./icons/thumbup";

type Variant = "good" | "bad";

interface GoodBadExampleProps
  extends React.PropsWithChildren,
    React.HTMLAttributes<HTMLDivElement> {
  variant: Variant;
  className: string;
}
export const GoodBadExample = ({
  variant,
  children,
  className,
  ...containerProps
}: GoodBadExampleProps) => {
  let backgroundColor = "svg-bg svg-tree-red";
  if (variant === "good") {
    backgroundColor = "svg-bg svg-tree-green";
  }

  return (
    <div className={cn(backgroundColor, className)} {...containerProps}>
      {children}
    </div>
  );
};

export const GoodBadTitle = ({
  variant,
  title,
}: {
  variant: Variant;
  title: string;
}) => {
  return (
    <div className="flex flex-row gap-3">
      <div
        className={cn(
          `flex-2 flex items-center justify-center svg-bg min-h-18.75 min-w-21.25`,
          variant === "good" ? "svg-equal-white" : "svg-inequal-white",
        )}
      >
        <ThumbUpIcon
          className={cn(
            `size-12`,
            "fill-foundations-violet-principal",
            variant === "good" ? "rotate-0" : "rotate-180",
          )}
        />
      </div>
      <h3 className="flex-5 flex items-center header-h4 text-foundations-blanc">
        {title}
      </h3>
    </div>
  );
};

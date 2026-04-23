import { cn } from '@/lib/utils';
import { ThumbUpIcon } from './icons/thumbup';

type Variant = "good" | "bad";

interface GoodBadExampleProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
  variant: Variant;
  className: string;
}
export const GoodBadExample = ({ variant, children, className, ...containerProps }: GoodBadExampleProps) =>{
  let backgroundColor = "svg-tree-red";
  if (variant === "good") {
    backgroundColor = "svg-tree-green";
  }

  return (
    <div className={cn(backgroundColor, className)} {...containerProps }>
      {children}
    </div>
  )
}


export const GoodBadTitle = ({ variant, title }: { variant: Variant, title: string; }) => {
  let backgroundEqual = "svg-inequal-white";
  if (variant === "good") {
    backgroundEqual = "svg-equal-white";
  }

  return (
    <div className="flex flex-row gap-[12px]">
      <div
        className={`flex-2 flex items-center justify-center svg-bg ${backgroundEqual} min-h-[75px] min-w-[85px]`}
      >
        <ThumbUpIcon
          fill="var(--color-foundations-violet-principal)"
          className={`size-12 ${variant === "good" ? "" : "rotate-180"}`}
        />
      </div>
      <h3 className="flex-5 flex items-center header-h4 text-foundations-blanc">
        {title}
      </h3>
    </div>
  )
}

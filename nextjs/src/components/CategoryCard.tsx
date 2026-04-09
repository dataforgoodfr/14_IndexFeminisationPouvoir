import Link from "next/link";
import type { SVGProps } from "react";

type CategoryCardProps = {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  href: string;
};

export function CategoryCard({
  icon: Icon,
  title,
  description,
  href,
}: CategoryCardProps) {
  return (
    <div className="bg-white border border-foundations-violet-clair flex flex-col items-center justify-center overflow-clip shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] w-[333px]">
      <div className="flex flex-col items-center justify-between p-4">
        <Icon width={97} height={90} />
      </div>
      <div className="flex flex-col gap-4 items-center justify-center p-4 w-full">
        <p className="header-h2 text-foundations-violet-principal text-center w-full">
          {title}
        </p>
      </div>
      <div className="h-[6px] w-[60px] bg-foundations-violet-clair rounded-[6px] shrink-0" />
      <div className="flex flex-col gap-4 items-center justify-center p-4 w-full">
        <p className="body2-regular text-black text-center">{description}</p>
      </div>
      <Link href={href} className="button button-primary mb-4">
        Consulter
      </Link>
    </div>
  );
}

"use client";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes, JSX } from "react";
import { cn } from "@/lib/utils";

type PouvoirSelectorProps = {
  title: React.ReactNode;
  icon: (props: HTMLAttributes<HTMLOrSVGElement>) => JSX.Element;
  href: Route;
};

export const PouvoirSelector = ({
  title,
  icon: Icon,
  ...linkProps
}: PouvoirSelectorProps) => {
  const activePath = usePathname().replace(/\/$/, "");
  const selectorPath = linkProps.href.replace(/#.+$/, "").replace(/\/$/, "");
  const isActive = activePath.startsWith(selectorPath);

  return (
    <Link
      className={cn(
        "flex-1 flex flex-col justify-center items-center p-2 gap-2 w-44 h-44 text-center",
        "border border-purple-oxfam-100 flex-none self-stretch",
        "bg-foundations-blanc",
        "hover:border hover:border-foundations-violet-principal hover:bg-foundations-violet-principal",
        "group/pouvoir svg svg-inequal",
        isActive &&
          "border-foundations-violet-principal bg-foundations-violet-principal",
      )}
      {...linkProps}
    >
      <Icon
        className={cn(
          "w-18 h-18 group-hover/pouvoir:fill-white fill-foundations-violet-principal",
          isActive && "fill-white",
        )}
      />

      <div
        className={cn(
          "text-center header-h4 group-hover/pouvoir:text-white text-foundations-noir whitespace-break-spaces w-full",
          isActive && "text-white",
        )}
      >
        {title}
      </div>
    </Link>
  );
};

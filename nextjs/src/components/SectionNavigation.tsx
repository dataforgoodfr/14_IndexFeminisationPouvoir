"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SectionNavigationProps = {
  label: string;
  href: Route;
  icon: React.ReactNode;
  isActive: boolean;
};
export const SectionNavigation = ({
  label,
  href,
  icon,
  isActive,
}: SectionNavigationProps) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          `flex flex-row lg:flex-col justify-between lg:justify-center items-center px-6 py-2 gap-3 rounded min-h-20 w-full lg:w-44 relative`,
          "border-foundations-violet-principal",
          isActive
            ? "bg-foundations-blanc border-b-4"
            : "bg-foundations-violet-tres-clair border-l-4 lg:border-l-0",
        )}
      >
        <h4 className="header-h4 text-center">{label}</h4>

        {/* the icon only shows when active on large screens, but always on small screens */}
        {isActive && <div className="hidden lg:block">{icon}</div>}
        <div className="lg:hidden">{icon}</div>

        {isActive && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-10 border-r-10 border-t-10 border-l-transparent border-r-transparent border-t-foundations-violet-principal" />
        )}
        {!isActive && (
          <div className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-10 border-b-10 border-l-10 border-t-transparent border-b-transparent border-l-foundations-violet-principal" />
        )}
      </div>
    </Link>
  );
};

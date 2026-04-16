"use client";

import type { Route } from "next";
import { usePathname } from "next/navigation";
import { SectionNavigation } from "./SectionNavigation";

type NavItem = {
  label: string;
  href: Route;
  icon: React.ReactNode;
};

type Props = {
  navItems: NavItem[];
  children: React.ReactNode;
  banner: React.ReactNode;
};

export const SectionGroup = ({ navItems, children, banner }: Props) => {
  const pathname = usePathname().replace(/\/$/, "");
  const activeItem = navItems.find((item) => item.href === pathname);
  const inactiveItems = navItems.filter((item) => item.href !== pathname);

  return (
    <>
      {/* Purple banner - always shown. Desktop: navs are absolutely positioned inside. */}
      <div className="w-full lg:relative flex flex-col items-center justify-start lg:mb-38">
        {banner}
        <div className="hidden lg:flex lg:absolute lg:top-full lg:-mt-10 items-start flex-row w-auto gap-4 z-2">
          {navItems.map((item) => (
            <SectionNavigation
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* Mobile: active nav above children */}
      {activeItem && (
        <div className="lg:hidden w-full">
          <SectionNavigation
            label={activeItem.label}
            href={activeItem.href}
            icon={activeItem.icon}
          />
        </div>
      )}

      {children}

      {/* Mobile: inactive navs below children */}
      {inactiveItems.length > 0 && (
        <div className="lg:hidden flex flex-col gap-4 w-full">
          {inactiveItems.map((item) => (
            <SectionNavigation
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </div>
      )}
    </>
  );
};

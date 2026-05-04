"use client";

import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
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
  const pathname = usePathname()
    .replace(/\/$/, "")
    .replace(/\/#.*$/, "");
  const activeItem = navItems.find((item) =>
    item.href
      .replace(/\/$/, "")
      .replace(/\/#.*$/, "")
      .startsWith(pathname),
  );

  const mobileNavRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (activeItem) {
      const element = mobileNavRefs.current[activeItem.href];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [activeItem]);

  return (
    <div className="flex flex-col gap-8 w-full">
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
              isActive={item.href === activeItem?.href}
            />
          ))}
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center justify-start">
        {children}
      </div>

      <div className="lg:hidden flex flex-col gap-4 w-full">
        {navItems.map((item) => {
          const isOpen = activeItem?.href === item.href;
          return (
            <div
              key={item.href}
              ref={(el) => {
                mobileNavRefs.current[item.href] = el;
              }}
            >
              <SectionNavigation
                label={item.label}
                href={item.href}
                icon={item.icon}
                isActive={false}
              />
              <div
                className={cn(
                  `grid`,
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div
                  className={cn(
                    `overflow-hidden mt-8`,
                    isOpen ? "opacity-100" : "opacity-0",
                  )}
                >
                  {children}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

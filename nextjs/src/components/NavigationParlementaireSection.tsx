"use client";

import { usePathname } from "next/navigation";
import { NavigationParlementaire } from "./NavigationParlementaire";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type Props = {
  navItems: NavItem[];
  children: React.ReactNode;
};

export const NavigationParlementaireSection = ({
  navItems,
  children,
}: Props) => {
  const pathname = usePathname().replace(/\/$/, "");
  const activeItem = navItems.find((item) => item.href === pathname);
  const inactiveItems = navItems.filter((item) => item.href !== pathname);

  return (
    <>
      {/* Purple banner - always shown. Desktop: navs are absolutely positioned inside. */}
      <div className="w-full lg:relative flex flex-col items-center justify-center lg:mb-38">
        <div className="w-full bg-foundations-violet-principal h-28 flex items-center justify-center">
          <div className="body4-medium text-foundations-blanc">
            Les chiffres en détails
          </div>
        </div>
        <div className="hidden lg:flex lg:absolute top-20 flex-row w-auto gap-4">
          {navItems.map((item) => (
            <NavigationParlementaire
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
          <NavigationParlementaire
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
            <NavigationParlementaire
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

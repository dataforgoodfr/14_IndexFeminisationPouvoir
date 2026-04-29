"use client";
import type { Route } from "next";
import Link from "next/link";
import type { JSX } from "react";
import { MondeIcon } from "@/components/icons/monde";
import { AutresPouvoirsIcon } from "@/components/icons/pouvoir-autres";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";
import { PouvoirSelector } from "@/components/PouvoirSelector";

export const PouvoirsSubmenu = () => {
  const menuItems: {
    label: string;
    href: Route;
    icon: (props: React.HTMLAttributes<HTMLOrSVGElement>) => JSX.Element;
    title: React.ReactNode;
  }[] = [
    {
      label: "Pouvoir exécutif",
      href: "/pouvoirs/executif",
      icon: PouvoirExecutifIcon,
      title: (
        <>
          Pouvoir
          <br /> exécutif
        </>
      ),
    },
    {
      label: "Pouvoir parlementaire",
      href: "/pouvoirs/parlementaire",
      icon: PouvoirParlementaireIcon,
      title: (
        <>
          Pouvoir
          <br /> parlementaire
        </>
      ),
    },
    {
      label: "Pouvoir local",
      href: "/pouvoirs/local",
      icon: PouvoirLocalIcon,
      title: (
        <>
          Pouvoir
          <br /> local
        </>
      ),
    },
    {
      label: "Autres pouvoirs",
      href: "/pouvoirs/autres",
      icon: AutresPouvoirsIcon,
      title: (
        <>
          Autres
          <br /> pouvoirs
        </>
      ),
    },
    {
      label: "Dans le monde",
      href: "/pouvoirs/monde",
      icon: MondeIcon,
      title: (
        <>
          Dans le
          <br /> monde
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="lg:hidden flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            scroll={false}
            key={item.href}
            href={item.href}
            className="block px-3 py-2 text-foundations-blanc hover:bg-black/10 rounded text-sm"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex flex-1 justify-center px-4 bg-foundations-violet-tres-clair">
        <div className="flex flex-col gap-4 w-full items-center py-4 md:items-start">
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {menuItems.map((item) => (
              <PouvoirSelector
                key={item.href}
                title={item.title}
                icon={item.icon}
                href={item.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

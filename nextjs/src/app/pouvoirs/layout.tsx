import Link, { type LinkProps } from "next/link";
import type { HTMLAttributes, JSX } from "react";
import { MondeIcon } from "@/components/icons/monde";
import { AutresPouvoirsIcon } from "@/components/icons/pouvoir-autres";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";
import { cn } from "@/lib/utils";

export default function PouvoirLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex flex-1 justify-center px-4 bg-purple-oxfam-100 ">
        <div className="flex flex-col gap-4 max-w-296 items-center  py-12 md:items-start ">
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <PouvoirSelector
              title={
                <>
                  Pouvoir
                  <br /> exécutif
                </>
              }
              icon={PouvoirExecutifIcon}
              href="/pouvoirs/executif"
            />
            <PouvoirSelector
              title={
                <>
                  Pouvoir
                  <br /> parlementaire
                </>
              }
              icon={PouvoirParlementaireIcon}
              href="/pouvoirs/parlementaire"
            />
            <PouvoirSelector
              title={
                <>
                  Pouvoir
                  <br /> local
                </>
              }
              icon={PouvoirLocalIcon}
              href="/pouvoirs/local"
            />
            <PouvoirSelector
              title={
                <>
                  Autres
                  <br /> pouvoirs
                </>
              }
              icon={AutresPouvoirsIcon}
              href="/pouvoirs/autres"
            />
            <PouvoirSelector
              title={
                <>
                  Dans le
                  <br /> monde
                </>
              }
              icon={MondeIcon}
              href="/pouvoirs/monde"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-20 gap-8  items-center justify-center ">
        {children}
      </div>
    </div>
  );
}

type PouvoirSelectorProps = LinkProps & {
  title: React.ReactNode;
  icon: (props: HTMLAttributes<HTMLOrSVGElement>) => JSX.Element;
};
const PouvoirSelector = ({
  title,
  icon: Icon,
  ...linkProps
}: PouvoirSelectorProps) => {
  return (
    <Link
      className={cn(
        "flex-1 flex flex-col justify-center items-center p-2 gap-2 w-44 h-44 text-center",
        "border border-purple-oxfam-100 flex-none self-stretch",
        "bg-foundations-blanc",
        "hover:border hover:border-foundations-violet-principal hover:bg-foundations-violet-principal",
        "group bg-svg-inequal",
      )}
      {...linkProps}
    >
      <Icon className="w-18 h-18 group-hover:fill-white" />

      <div className="text-center header-h4 group-hover:text-white whitespace-break-spaces w-full">
        {title}
      </div>
    </Link>
  );
};

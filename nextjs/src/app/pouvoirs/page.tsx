import Link, { type LinkProps } from "next/link";
import type { HTMLAttributes, JSX } from "react";
import { Inequal } from "@/components/icons/inequal";
import { MondeIcon } from "@/components/icons/monde";
import { AutresPouvoirsIcon } from "@/components/icons/pouvoir-autres";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <div className="flex flex-1 justify-center px-4 bg-purple-oxfam-100 ">
      <div className="flex flex-col gap-4 max-w-296 items-center  py-12 md:items-start ">
        <div className="flex flex-col w-full items-center md:items-start gap-2 ">
          <h1 className="text-2xl font-bold">Explorer les données</h1>
          <p className="flex gap-6">
            Sélectionnez une categorie pour visualiser les donnees detaillées
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <PouvoirSelector
            title="Pouvoir exécutif"
            icon={PouvoirExecutifIcon}
            href="./executif"
          />
          <PouvoirSelector
            title="Pouvoir parlementaire"
            icon={PouvoirParlementaireIcon}
            href="./parlementaire"
          />
          <PouvoirSelector
            title="Pouvoir local"
            icon={PouvoirLocalIcon}
            href="./local"
          />
          <PouvoirSelector
            title="Autres pouvoirs"
            icon={AutresPouvoirsIcon}
            href="./autres"
          />
          <PouvoirSelector
            title="Dans le monde"
            icon={MondeIcon}
            href="./monde"
          />
        </div>
      </div>
    </div>
  );
}

type PouvoirSelectorProps = LinkProps & {
  title: string;
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

      <div className="font-semibold text-center text-sm max-w-20 group-hover:text-white">
        {title}
      </div>
    </Link>
  );
};

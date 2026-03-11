import Link, { type LinkProps } from "next/link";
import type { HTMLAttributes, JSX } from "react";
import { AutresPouvoirsIcon } from "@/components/icons/pouvoir-autres";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";
import { UnionEuropeenneIcon } from "@/components/icons/union-europeenne";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <div className="flex  justify-center items-center">
      <div className="flex flex-col gap-4 max-w-296 items-center justify-between py-12 md:items-start">
        <div className="flex flex-col w-full items-center md:items-start gap-2 ">
          <h1 className="text-2xl font-bold">Explorer les données</h1>
          <p className="flex gap-6">
            Sélectionnez une categorie pour visualiser les donnees detaillées
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <PouvoirSelector
            title="Pouvoir Exécutif"
            icon={PouvoirExecutifIcon}
            href="./executif"
          />
          <PouvoirSelector
            title="Pouvoir Local"
            icon={PouvoirLocalIcon}
            href="./local"
          />
          <PouvoirSelector
            title="Pouvoir Parlementaire"
            icon={PouvoirParlementaireIcon}
            href="./parlementaire"
          />
          <PouvoirSelector
            title="Autres pouvoirs"
            icon={AutresPouvoirsIcon}
            href="./autres"
          />
          <PouvoirSelector
            title="Union Européenne"
            icon={UnionEuropeenneIcon}
            href="./union-europeenne"
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
        "flex flex-col justify-center items-center p-2 gap-2 w-sm h-44",
        "bg-linear-to-b from-purple-200/24 to-purple-900/5 border border-purple-300 rounded-2xl flex-none self-stretch",
        "hover:border-2 hover:border-[#513893]",
      )}
      {...linkProps}
    >
      <Icon className="w-20 h-20" />
      <div className="font-semibold">{title}</div>
    </Link>
  );
};

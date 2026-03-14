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
    <div className="flex  justify-center items-center px-4">
      <div className="flex flex-col gap-4 max-w-296 items-center justify-between py-12 md:items-start">
        <div className="flex flex-col w-full items-center md:items-start gap-2 ">
          <h1 className="text-2xl font-bold">Explorer les données</h1>
          <p className="flex gap-6">
            Sélectionnez une categorie pour visualiser les donnees detaillées
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
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
        "flex-1 flex flex-col justify-center items-center p-2 gap-2 w-32 h-32 text-center",
        "border border-[#C9C4E4] rounded-2xl flex-none self-stretch",
        "hover:border hover:border-[#513893]",
        "bg-linear-to-b from-[rgba(179,138,191,0.24)] to-[rgba(83,64,89,0.05)]",
      )}
      {...linkProps}
    >
      <Icon className="w-12 h-12" />
      <div className="font-semibold text-sm">{title}</div>
    </Link>
  );
};

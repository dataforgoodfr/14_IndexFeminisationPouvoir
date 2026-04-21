"use client";
import Link from "next/link";
import { MondeIcon } from "@/components/icons/monde";
import { AutresPouvoirsIcon } from "@/components/icons/pouvoir-autres";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";
import { PouvoirSelector } from "@/components/PouvoirSelector";

export const PouvoirsSubmenu = () => {
  return (
    <div>
      <div className="lg:hidden flex flex-col gap-2">
        <Link
          href="/pouvoirs/executif"
          className="block px-3 py-2 text-foundations-blanc hover:bg-black/10 rounded text-sm"
        >
          Pouvoir exécutif
        </Link>
        <Link
          href="/pouvoirs/parlementaire"
          className="block px-3 py-2 text-foundations-blanc hover:bg-black/10 rounded text-sm"
        >
          Pouvoir parlementaire
        </Link>
        <Link
          href="/pouvoirs/local"
          className="block px-3 py-2 text-foundations-blanc hover:bg-black/10 rounded text-sm"
        >
          Pouvoir local
        </Link>
        <Link
          href="/pouvoirs/autres"
          className="block px-3 py-2 text-foundations-blanc hover:bg-black/10 rounded text-sm"
        >
          Autres pouvoirs
        </Link>
        <Link
          href="/pouvoirs/monde"
          className="block px-3 py-2 text-foundations-blanc hover:bg-black/10 rounded text-sm"
        >
          Dans le monde
        </Link>
      </div>

      <div className="hidden lg:flex flex-1 justify-center px-4 bg-foundations-violet-tres-clair">
        <div className="flex flex-col gap-4 w-full items-center py-4 md:items-start ">
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <PouvoirSelector
              title={
                <>
                  Pouvoir
                  <br /> exécutif
                </>
              }
              icon={PouvoirExecutifIcon}
              href="/pouvoirs/executif#pouvoir-executif"
            />
            <PouvoirSelector
              title={
                <>
                  Pouvoir
                  <br /> parlementaire
                </>
              }
              icon={PouvoirParlementaireIcon}
              href="/pouvoirs/parlementaire#pouvoir-parlementaire"
            />
            <PouvoirSelector
              title={
                <>
                  Pouvoir
                  <br /> local
                </>
              }
              icon={PouvoirLocalIcon}
              href="/pouvoirs/local#pouvoir-local"
            />
            <PouvoirSelector
              title={
                <>
                  Autres
                  <br /> pouvoirs
                </>
              }
              icon={AutresPouvoirsIcon}
              href="/pouvoirs/autres#autres-pouvoirs"
            />
            <PouvoirSelector
              title={
                <>
                  Dans le
                  <br /> monde
                </>
              }
              icon={MondeIcon}
              href="/pouvoirs/monde#dans-le-monde"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

import { getTranslations } from "next-intl/server";
import { InfoBox } from "@/components/InfoBox";
import { HauteAutoritéIcon } from "@/components/icons/haute-autorite";
import { LiensCTA } from "@/components/LiensCTA";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { ShortDate } from "@/components/ShortDate";
import autresData from "@/data/pouvoir_autres.json";
import { richComponents } from "@/lib/utils";

const { haute_autorite: ha } = autresData;
const ANNEE = new Date(ha.dateMiseAJour).getFullYear();

export default async function HauteAutoritePage() {
  const t = await getTranslations("pouvoirs.autres.hautes-autorites");
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h2 text-foundations-violet-principal text-center">
          Haute autorité / Agences de l'état
        </h2>
        <p className="body2-regular text-black">
          Dernière mise à jour : <ShortDate date={new Date(ha.dateMiseAJour)} />
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>

      <div className="w-full max-w-3xl flex flex-col lg:flex-row items-center lg:items-start gap-9">
        <PouvoirFigureL
          valeur={ha.score}
          intitule={
            <>
              président une haute autorité ou
              <br /> une agence française
            </>
          }
          annee={ANNEE}
          evolution={ha.evolution}
          withChart
          icon={HauteAutoritéIcon}
          chartClassName="h-41 w-41"
        />
        <LiensCTA />
      </div>

      <InfoBox>
        <div className="flex flex-col gap-4 max-w-3xl">
          {t.rich("infobox", richComponents)}
        </div>
      </InfoBox>
    </div>
  );
}

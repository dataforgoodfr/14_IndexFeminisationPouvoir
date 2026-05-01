import { getTranslations } from "next-intl/server";
import { FranceDepartementsOutremerSVG } from "@/components/FranceDepartementsOutremerSVG";
import { InfoBox } from "@/components/InfoBox";
import { PréfecturesIcon } from "@/components/icons/prefectures";
import { LiensCTA, sourceURLs } from "@/components/LiensCTA";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { ShortDate } from "@/components/ShortDate";
import autresData from "@/data/pouvoir_autres.json";
import { richComponents } from "@/lib/utils";

const { prefectures: pref } = autresData;
const ANNEE = new Date(pref.dateMiseAJour).getFullYear();

export default async function PrefecturesPage() {
  const t = await getTranslations("pouvoirs.autres.prefectures");

  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h2 text-foundations-violet-principal text-center">
          Préfectures
        </h2>
        <p className="body2-regular text-black">
          Dernière mise à jour :{" "}
          <ShortDate date={new Date(pref.dateMiseAJour)} />
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>

      <div className="w-full flex flex-col lg:flex-row items-start gap-12">
        <FranceDepartementsOutremerSVG
          className="w-full lg:w-1/2 shrink-0"
          departementsFemmesPrefetes={pref.departements_femmes_prefetes}
        />

        <div className="flex flex-col gap-8 flex-1">
          <PouvoirFigureL
            valeur={pref.score}
            intitule="préfètes"
            annee={ANNEE}
            evolution={pref.evolution}
            withChart
            icon={PréfecturesIcon}
            chartClassName="w-41 h-41"
          />
          <div className="flex flex-col lg:items-start gap-4">
            <InfoBox>
              <div className="flex flex-col gap-3">
                {t.rich("infobox", richComponents)}
              </div>
            </InfoBox>
            <LiensCTA
              downloadURL={sourceURLs.autres.prefetes}
              variant="horizontal"
              className="justify-center lg:justify-normal lg:self-end"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

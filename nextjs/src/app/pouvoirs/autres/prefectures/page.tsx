import { FranceDepartementsOutremerSVG } from "@/components/FranceDepartementsOutremerSVG";
import { InfoBox } from "@/components/InfoBox";
import { PréfecturesIcon } from "@/components/icons/prefectures";
import { LiensCTA } from "@/components/LiensCTA";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { ShortDate } from "@/components/ShortDate";
import autresData from "@/data/pouvoir_autres.json";

const { prefectures: pref } = autresData;
const ANNEE = new Date(pref.dateMiseAJour).getFullYear();

export default function PrefecturesPage() {
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
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-9">
            <PouvoirFigureL
              valeur={pref.score}
              intitule="femmes préfètes"
              annee={ANNEE}
              evolution={pref.evolution}
              withChart
              icon={PréfecturesIcon}
            />
            <LiensCTA />
          </div>

          <InfoBox>
            <div className="flex flex-col gap-3">
              {pref.description.map((point, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                <p key={i} className="body2-regular">
                  {point}
                </p>
              ))}
            </div>
          </InfoBox>
        </div>
      </div>
    </div>
  );
}

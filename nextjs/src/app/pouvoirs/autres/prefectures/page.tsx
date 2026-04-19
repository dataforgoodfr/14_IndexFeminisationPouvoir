import Link from "next/link";
import { FranceDepartementsOutremerSVG } from "@/components/FranceDepartementsOutremerSVG";
import { InfoBox } from "@/components/InfoBox";
import { DownloadIcon } from "@/components/icons/download";
import { PréfecturesIcon } from "@/components/icons/prefectures";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { Tooltip } from "@/components/Tooltip";
import autresData from "@/data/pouvoir_autres.json";

const { prefectures: pref } = autresData;
const ANNEE = 2025;

export default function PrefecturesPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-screen-xl mx-auto w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h1 text-foundations-violet-principal text-center">
          Préfectures
        </h2>
        <p className="body2-regular text-black">
          Dernière mise à jour :{" "}
          {new Date(pref.dateMiseAJour).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>

      <div className="w-full flex flex-col lg:flex-row items-start gap-12">
        <FranceDepartementsOutremerSVG
          className="w-full lg:w-1/2 shrink-0"
          departementsFemmesPrefetes={pref.departements_femmes_prefetes}
          outreMerFemmesPrefetes={pref.outre_mer_femmes_prefetes}
        />

        <div className="flex flex-col gap-8 flex-1">
          <div className="flex flex-row items-start gap-9">
            <PouvoirFigureL
              valeur={pref.score}
              intitule="femmes préfètes"
              annee={ANNEE}
              evolution={pref.evolution}
              withChart
              icon={PréfecturesIcon}
            />
            <div className="flex flex-col gap-4 shrink-0">
              <Link href="/methodologie">
                <Tooltip
                  text="Méthode de calcul"
                  icon={<QuestionMarkIcon className="w-12.5 h-12.5" />}
                />
              </Link>
              <Link href="/telecharger">
                <Tooltip
                  text="Télécharger les données"
                  icon={<DownloadIcon className="w-12.5 h-12.5" />}
                />
              </Link>
            </div>
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

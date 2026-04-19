import Link from "next/link";
import { FranceMapSVG } from "@/components/FranceMapSVG";
import { DownloadIcon } from "@/components/icons/download";
import { PréfecturesIcon } from "@/components/icons/prefectures";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { OutreMerGrid } from "@/components/OutreMerMap";
import { Tooltip } from "@/components/Tooltip";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import autresData from "@/data/pouvoir_autres.json";

const { prefectures: pref } = autresData;
const ANNEE = 2025;

const dataPerRegion = Object.fromEntries(
  pref.regions.map((r) => [r.nom, { percentage: r.percentage, evolution: r.evolution }]),
);

const dataOutreMer = Object.fromEntries(
  pref.outre_mer.map((t) => [t.nom, { percentage: t.percentage, evolution: t.evolution }]),
);

export default function PrefecturesPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-[1200px] mx-auto w-full">
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

      <div className="w-full max-w-[768px] flex flex-col gap-3">
        {pref.description.map((point, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <p key={i} className="body2-regular text-black">
            {point}
          </p>
        ))}
      </div>

      <div className="w-full max-w-[768px] flex flex-row items-start gap-9">
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

      <FranceMapSVG
        fillColor="var(--color-purple-oxfam-600)"
        className="size-80 md:size-130"
        dataPerRegion={dataPerRegion}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4 w-full max-w-[900px] justify-items-center">
        <OutreMerGrid dataPerRegion={dataOutreMer} />
      </div>
    </div>
  );
}

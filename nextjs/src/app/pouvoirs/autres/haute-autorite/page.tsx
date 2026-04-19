import Link from "next/link";
import { Block } from "@/components/Block";
import { InfoBox } from "@/components/InfoBox";
import { DownloadIcon } from "@/components/icons/download";
import { HauteAutoritéIcon } from "@/components/icons/haute-autorite";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { Tooltip } from "@/components/Tooltip";
import autresData from "@/data/pouvoir_autres.json";

const { haute_autorite: ha } = autresData;
const ANNEE = 2025;

export default function HauteAutoritePage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-screen-xl mx-auto w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h1 text-foundations-violet-principal text-center">
          Haute autorité / Agences de l'état
        </h2>
        <p className="body2-regular text-black">
          Dernière mise à jour :{" "}
          {new Date(ha.dateMiseAJour).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>

      <div className="w-full max-w-[768px] flex flex-row items-start gap-9">
        <PouvoirFigureL
          valeur={ha.score}
          intitule="présidant les hautes autorités et agences de l'État"
          annee={ANNEE}
          evolution={ha.evolution}
          withChart
          icon={HauteAutoritéIcon}
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

      <Block
        titre="Définition"
        dateMiseAJour={new Date(ha.dateMiseAJour)}
        className="w-full max-w-[768px]"
        cardClassName="pt-12 px-6 pb-6"
      >
        <div className="flex flex-col gap-4">
          {ha.description.map((point, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <p key={i} className="body2-regular text-black">
              {point}
            </p>
          ))}
          <InfoBox>
            <p className="body2-regular">{ha.infobox}</p>
          </InfoBox>
        </div>
      </Block>
    </div>
  );
}

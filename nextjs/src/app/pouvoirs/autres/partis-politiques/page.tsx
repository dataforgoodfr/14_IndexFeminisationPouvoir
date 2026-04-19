import Link from "next/link";
import { Block } from "@/components/Block";
import { EvolutionBadge } from "@/components/EvolutionBadge";
import { InfoBox } from "@/components/InfoBox";
import { DownloadIcon } from "@/components/icons/download";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { Tooltip } from "@/components/Tooltip";
import { PersonGrid } from "@/components/PersonGrid";
import autresData from "@/data/pouvoir_autres.json";

const { partis_politiques: pp } = autresData;
const ANNEE = 2025;

export default function PartisPolitiquesPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h1 text-foundations-violet-principal text-center">
          Partis politiques
        </h2>
        <p className="body2-regular text-black">
          Dernière mise à jour :{" "}
          {new Date(pp.dateMiseAJour).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>

      <div className="w-full max-w-[768px] flex flex-row items-start gap-9">
        <div className="flex flex-col gap-5 flex-1">
          <PersonGrid femmes={pp.femmes} hommes={pp.total - pp.femmes} />
          <div className="flex flex-row gap-2 items-start">
            <span
              className="text-chiffre-l text-foundations-violet-principal leading-none"
              style={{ fontFamily: "var(--font-oxfam-tstar-pro)" }}
            >
              {pp.femmes}/{pp.total}
            </span>
            <EvolutionBadge value={pp.evolution} />
            <div className="flex flex-col text-foundations-violet-principal">
              <span className="text-femmes-xl lowercase">de femmes</span>
              <span className="header-h3 uppercase">
                dirigeant un parti politique
              </span>
              <span className="header-h3 uppercase">en {ANNEE}</span>
            </div>
          </div>
        </div>
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
        titre="Contexte"
        dateMiseAJour={new Date(pp.dateMiseAJour)}
        className="w-full max-w-[768px]"
        cardClassName="pt-12 px-6 pb-6"
      >
        <div className="flex flex-col gap-4">
          <p className="body2-regular text-black">{pp.context}</p>
          <InfoBox>
            <p className="body2-regular">{pp.infobox}</p>
          </InfoBox>
        </div>
      </Block>
    </div>
  );
}

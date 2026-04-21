import Link from "next/link";
import { Block } from "@/components/Block";
import { EvolutionBadge } from "@/components/EvolutionBadge";
import { InfoBox } from "@/components/InfoBox";
import { AmbassadesIcon } from "@/components/icons/ambassades";
import { DownloadIcon } from "@/components/icons/download";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { PersonGrid } from "@/components/PersonGrid";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { ShortDate } from "@/components/ShortDate";
import { Tooltip } from "@/components/Tooltip";
import { WorldMapSVG } from "@/components/WorldMapSVG";
import autresData from "@/data/pouvoir_autres.json";

const { ambassades: amb } = autresData;
const ANNEE = new Date(amb.dateMiseAJour).getFullYear();

export default function AmbassadesPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h1 text-foundations-violet-principal text-center">
          Ambassades
        </h2>
        <p className="body2-regular text-black">
          Dernière mise à jour :{" "}
          <ShortDate date={new Date(amb.dateMiseAJour)} />
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-3">
        {amb.description.map((point, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <p key={i} className="body2-regular text-black">
            {point}
          </p>
        ))}
      </div>

      <div className="w-full max-w-3xl flex flex-row items-start gap-9">
        <PouvoirFigureL
          valeur={amb.score}
          intitule="ambassadrices de France"
          annee={ANNEE}
          evolution={amb.evolution}
          withChart
          icon={AmbassadesIcon}
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

      <WorldMapSVG
        femmeAmbassadrices={amb.pays_femmes_ambassadrices}
        className="w-full max-w-225"
      />

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-225">
        <Block
          titre="G7"
          className="flex-1 min-w-0"
          cardClassName="pt-16 px-4 pb-6"
        >
          <div className="flex flex-col gap-5">
            <PersonGrid
              femmes={amb.g7.femmes}
              hommes={amb.g7.total - amb.g7.femmes}
            />
            <div className="flex flex-row gap-2 items-start">
              <span
                className="text-chiffre-l text-foundations-violet-principal leading-none"
                style={{ fontFamily: "var(--font-oxfam-tstar-pro)" }}
              >
                {amb.g7.femmes}/{amb.g7.total}
              </span>
              <EvolutionBadge value={amb.evolution} />
              <div className="flex flex-col text-foundations-violet-principal">
                <span className="text-femmes-xl lowercase">de femmes</span>
                <span className="header-h3 uppercase">
                  ambassadrices de France au G7
                </span>
                <span className="header-h3 uppercase">en {ANNEE}</span>
              </div>
            </div>
            <InfoBox>
              <p className="body2-regular">{amb.g7.infobox}</p>
            </InfoBox>
          </div>
        </Block>

        <Block
          titre="G20"
          className="flex-1 min-w-0"
          cardClassName="pt-16 px-4 pb-6"
        >
          <div className="flex flex-col gap-5">
            <PersonGrid
              femmes={amb.g20.femmes}
              hommes={amb.g20.total - amb.g20.femmes}
            />
            <div className="flex flex-row gap-2 items-start">
              <span
                className="text-chiffre-l text-foundations-violet-principal leading-none"
                style={{ fontFamily: "var(--font-oxfam-tstar-pro)" }}
              >
                {amb.g20.femmes}/{amb.g20.total}
              </span>
              <EvolutionBadge value={amb.evolution} />
              <div className="flex flex-col text-foundations-violet-principal">
                <span className="text-femmes-xl lowercase">de femmes</span>
                <span className="header-h3 uppercase">
                  ambassadrices de France au G20
                </span>
                <span className="header-h3 uppercase">en {ANNEE}</span>
              </div>
            </div>
            <InfoBox>
              <p className="body2-regular">{amb.g20.infobox}</p>
            </InfoBox>
          </div>
        </Block>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-4">
        <h3 className="header-h3 text-foundations-violet-principal uppercase">
          Mais aussi...
        </h3>
        <p className="body2-regular text-black">{amb.mais_aussi}</p>
        <ul className="flex flex-col gap-2">
          {amb.objectifs.map((obj, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <li key={i} className="body2-regular text-black flex gap-2">
              <span className="text-foundations-violet-principal shrink-0">
                •
              </span>
              {obj}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { getTranslations } from "next-intl/server";
import { Block } from "@/components/Block";
import { EvolutionBadge } from "@/components/EvolutionBadge";
import { InfoBox } from "@/components/InfoBox";
import { AmbassadesIcon } from "@/components/icons/ambassades";
import { LiensCTA } from "@/components/LiensCTA";
import { PersonGrid } from "@/components/PersonGrid";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { ShortDate } from "@/components/ShortDate";
import { WorldMapSVG } from "@/components/WorldMapSVG";
import autresData from "@/data/pouvoir_autres.json";
import { richComponents } from "@/lib/utils";

const { ambassades: amb } = autresData;
const ANNEE = new Date(amb.dateMiseAJour).getFullYear();

export default async function AmbassadesPage() {
  const t = await getTranslations("pouvoirs.autres.ambassades");

  return (
    <>
      <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center gap-3">
          <h2 className="header-h2 text-foundations-violet-principal text-center">
            Ambassades
          </h2>
          <p className="body2-regular text-black">
            Dernière mise à jour :{" "}
            <ShortDate date={new Date(amb.dateMiseAJour)} />
          </p>
          <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <WorldMapSVG
            highlightedCountries={amb.pays_femmes_ambassadrices}
            className="w-full max-w-225"
          />

          <div className="flex flex-col gap-8">
            <div className="w-full max-w-3xl flex flex-col lg:flex-row items-center lg:items-start gap-9">
              <PouvoirFigureL
                valeur={amb.score}
                intitule="ambassadrices de France"
                annee={ANNEE}
                evolution={amb.evolution}
                withChart
                icon={AmbassadesIcon}
                chartClassName="w-41 h-41"
              />
              <LiensCTA />
            </div>
            <InfoBox>
              <div className="flex flex-col gap-2">
                {t.rich("infobox", richComponents)}
              </div>
            </InfoBox>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-8 ">
          <Block
            titre="G7"
            className="flex-1  max-w-225"
            cardClassName="pt-16 px-4 pb-6"
          >
            <Figure
              femmes={amb.g7.femmes}
              total={amb.g7.total}
              evolution={amb.g7.evolution}
              intitule="ambassadrices pour la France"
              annee={ANNEE}
            />
          </Block>

          <Block
            titre="G20"
            className="flex-1  max-w-225"
            cardClassName="pt-16 px-4 pb-6"
          >
            <Figure
              femmes={amb.g20.femmes}
              total={amb.g20.total}
              evolution={amb.evolution}
              intitule="ambassadrices pour la France"
              annee={ANNEE}
            />
          </Block>
        </div>
      </div>
      <div className="w-full  bg-foundations-violet-clair flex justify-center py-16">
        <div className="max-w-3xl flex flex-col gap-4 p-8 ">
          <h3 className="header-h3 text-foundations-violet-principal uppercase">
            Mais aussi...
          </h3>
          <div className="body2-regular text-black flex flex-col gap-4">
            {t.rich("mais_aussi", richComponents)}
          </div>
        </div>
      </div>
    </>
  );
}

type FigureProps = {
  femmes: number;
  total: number;
  evolution: number;
  intitule: string;
  annee: number;
};
const Figure = ({ femmes, total, evolution, intitule, annee }: FigureProps) => (
  <div className="flex flex-col gap-5">
    <PersonGrid femmes={femmes} hommes={total - femmes} />
    <div className="flex flex-col lg:flex-row  gap-2 items-center lg:items-start">
      <div className="flex flex-row  gap-2 items-start">
        <span
          className="text-chiffre-l text-foundations-violet-principal leading-none"
          style={{ fontFamily: "var(--font-oxfam-tstar-pro)" }}
        >
          {femmes}/{total}
        </span>
      </div>
      <EvolutionBadge value={evolution} />
      <div className="flex flex-col items-center lg:items-start text-foundations-violet-principal">
        <span className="text-femmes-xl lowercase">de femmes</span>
        <span className="header-h3 uppercase text-center lg:text-left">
          {intitule}
        </span>
        <span className="header-h3 uppercase">en {annee}</span>
      </div>
    </div>
  </div>
);

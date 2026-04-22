import { Block } from "@/components/Block";
import { InfoBox } from "@/components/InfoBox";
import { HauteAutoritéIcon } from "@/components/icons/haute-autorite";
import { LiensCTA } from "@/components/LiensCTA";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { ShortDate } from "@/components/ShortDate";
import autresData from "@/data/pouvoir_autres.json";

const { haute_autorite: ha } = autresData;
const ANNEE = new Date(ha.dateMiseAJour).getFullYear();

export default function HauteAutoritePage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h1 text-foundations-violet-principal text-center">
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
          intitule="présidant les hautes autorités et agences de l'État"
          annee={ANNEE}
          evolution={ha.evolution}
          withChart
          icon={HauteAutoritéIcon}
        />
        <LiensCTA />
      </div>

      <Block
        titre="Définition"
        dateMiseAJour={new Date(ha.dateMiseAJour)}
        className="w-full max-w-3xl"
        cardClassName="pt-16 px-6 pb-6"
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

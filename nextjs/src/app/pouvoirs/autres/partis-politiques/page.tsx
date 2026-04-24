import { Block } from "@/components/Block";
import { InfoBox } from "@/components/InfoBox";
import { LiensCTA } from "@/components/LiensCTA";
import { PersonGrid } from "@/components/PersonGrid";
import { PouvoirFigureRelative } from "@/components/PouvoirFigureRelative";
import { ShortDate } from "@/components/ShortDate";
import autresData from "@/data/pouvoir_autres.json";

const { partis_politiques: pp } = autresData;
const ANNEE = new Date(pp.dateMiseAJour).getFullYear();

export default function PartisPolitiquesPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h2 text-foundations-violet-principal text-center">
          Partis politiques
        </h2>
        <p className="body2-regular text-black">
          Dernière mise à jour : <ShortDate date={new Date(pp.dateMiseAJour)} />
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>

      <div className="w-full max-w-3xl flex flex-col lg:flex-row items-center lg:items-start gap-9">
        <div className="flex flex-col gap-5 flex-1">
          <PersonGrid femmes={pp.femmes} hommes={pp.total - pp.femmes} />
          <PouvoirFigureRelative
            femmes={pp.femmes}
            total={pp.total}
            intitule="dirigeant un parti politique"
            annee={ANNEE}
            evolution={pp.evolution}
          />
        </div>
        <LiensCTA />
      </div>

      <Block
        titre="Contexte"
        dateMiseAJour={new Date(pp.dateMiseAJour)}
        className="w-full max-w-3xl"
        cardClassName="pt-16 px-6 pb-6"
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

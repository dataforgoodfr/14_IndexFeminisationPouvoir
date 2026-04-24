import { getTranslations } from "next-intl/server";
import { InfoBox } from "@/components/InfoBox";
import { LiensCTA } from "@/components/LiensCTA";
import { PersonGrid } from "@/components/PersonGrid";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureRelative } from "@/components/PouvoirFigureRelative";
import { ShortDate } from "@/components/ShortDate";
import autresData from "@/data/pouvoir_autres.json";
import { richComponents } from "@/lib/utils";

const { partis_politiques: pp } = autresData;
const ANNEE = new Date(pp.dateMiseAJour).getFullYear();

export default async function PartisPolitiquesPage() {
  const t = await getTranslations("pouvoirs.autres.partis");
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

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-9">
        <div className="flex flex-col items-center justify-center gap-5 flex-1">
          <PersonGrid femmes={pp.femmes} hommes={pp.total - pp.femmes} />
          <div className="flex flex-col lg:flex-row gap-4">
            <PouvoirFigureL
              valeur={(100 * pp.femmes) / pp.total}
              intitule={
                <>
                  à la tête des principaux <br />
                  partis politiques français
                </>
              }
              annee={ANNEE}
              evolution={pp.evolution}
            />
            <LiensCTA />
          </div>
        </div>
      </div>

      <InfoBox>
        <div className="flex flex-col gap-4 max-w-xl">
          {t.rich("infobox", richComponents)}
        </div>
      </InfoBox>
    </div>
  );
}

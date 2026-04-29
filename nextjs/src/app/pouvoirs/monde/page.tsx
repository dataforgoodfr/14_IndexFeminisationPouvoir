import { GoodBadExample, GoodBadTitle } from "@/components/GoodBadExample";
import { GlobeIcon } from "@/components/icons/globe";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { Standings } from "@/components/Standings";
import { WorldMapSVG } from "@/components/WorldMapSVG";
import { monde } from "@/data/pouvoir.json";

export default function DansLeMondePage() {
  const pays = monde.composantes.parite_gouvernement;
  const pires = pays.toReversed().slice(0, 8);
  const meilleurs = pays.slice(0, 5);
  return (
    <div className="max-w-6xl pt-10">
      <div className="md:flex md:flex-row md:items-center">
        <div className="flex-1 px-10 md:px-5 md:flex-3">
          <WorldMapSVG highlightedCountries={monde.composantes.cheffes_detat} />
        </div>
        <div className="flex-1 md:flex-2">
          <PouvoirFigureL
            annee={monde.annee}
            icon={GlobeIcon} // TODO
            intitule="Cheffes d'état"
            valeur={monde.score}
            evolution={monde.evolution}
            withChart
            withButtons
          />
        </div>
      </div>
      <div className="h-40 w-full" />
      <div className="w-full flex items-center">
        <h2 className="header-h1 text-foundations-violet-principal text-center">
          État de la parité au sein des gouvernements mondiaux
        </h2>
      </div>
      <div className="flex flex-col md:flex-row gap-x-8 gap-y-8 px-5 md:px-5 py-11">
        <GoodBadExample variant="bad" className="flex-1 px-5 py-5">
          <GoodBadTitle
            variant="bad"
            title="Les mauvais élèves avec aucune femme au gouvernement"
          />
          <Standings
            thumbsDownBottom={10}
            data={pires.map(({ pays, pourcentage, evolution }) => ({
              label: pays,
              percentage: pourcentage,
              evolution,
            }))}
            order="ascending"
          />
        </GoodBadExample>
        <GoodBadExample variant="good" className="flex-1 px-5 py-5">
          <GoodBadTitle
            variant="good"
            title="Les pays les plus exemplaires en matière de parité au gouvernement"
          />
          <Standings
            thumbsUpTop={10}
            data={meilleurs.map(({ pays, pourcentage, evolution }) => ({
              label: pays,
              percentage: pourcentage,
              evolution,
            }))}
          />
        </GoodBadExample>
      </div>
    </div>
  );
}

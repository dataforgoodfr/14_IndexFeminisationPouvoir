import { getTranslations } from "next-intl/server";
import { GoodBadExample, GoodBadTitle } from "@/components/GoodBadExample";
import { InfoBox } from "@/components/InfoBox";
import { FemmeAuGouvernementIcon } from "@/components/icons/femme-gouvernement";
import { NavigationMonde } from "@/components/NavigationMonde";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { Standings } from "@/components/Standings";
import { WorldMapSVG } from "@/components/WorldMapSVG";
import { monde } from "@/data/pouvoir.json";
import { richComponents } from "@/lib/utils";

const items = [
  {
    label: "Cheffes d'état",
    ...monde.composantes.cheffes_detat,
  },
  {
    label: "Cheffes de gouvernement",
    ...monde.composantes.cheffes_gouvernement,
  },
  {
    label: "Cheffes d'état et de gouvernement",
    ...monde.composantes.cheffes_detat_et_gouvernement,
  },
  {
    label: "Les plus hauts taux de parité",
    subtitle: "Les pays avec les plus hauts taux de parité sont :",
    top: monde.composantes.parite_gouvernement.slice(0, 5),
    pays: monde.composantes.parite_gouvernement
      .slice(0, 20)
      .map(({ id }) => id),
    analyse: "plus_haut_taux_parité" as const,
  },
];

export default async function DansLeMondePage() {
  const t = await getTranslations("pouvoirs.monde");

  const pires = monde.composantes.parite_gouvernement.toReversed().slice(0, 8);
  const meilleurs = monde.composantes.parite_gouvernement.slice(0, 5);
  return (
    <div className="max-w-6xl pt-10">
      <NavigationMonde
        items={items.map((item) => ({
          label: item.label,
          component: (
            <div className="md:flex md:flex-row md:items-center p-4">
              <div className="flex-1 px-10 md:px-5 md:flex-3">
                <WorldMapSVG highlightedCountries={item.pays} />
              </div>
              {"score" in item && (
                <div className="flex-1 md:flex-2">
                  <PouvoirFigureL
                    annee={monde.annee}
                    icon={FemmeAuGouvernementIcon}
                    intitule={item.label}
                    valeur={item.score}
                    evolution={item.evolution}
                    withChart
                    withButtons
                    variant="light"
                  />
                </div>
              )}
              {"top" in item && item.top && (
                <div className="flex-1 md:flex-2 flex flex-col lg:min-w-135 gap-4">
                  <h3 className="header-h3 text-foundations-violet-principal">
                    {item.subtitle}
                  </h3>
                  <Standings
                    data={item.top.map((x) => ({
                      label: x.pays,
                      percentage: x.pourcentage,
                      evolution: undefined,
                    }))}
                    thumbsUpTop={item.top.length}
                  />
                  <InfoBox className="body1-medium">
                    {t.rich(item.analyse, richComponents)}
                  </InfoBox>
                </div>
              )}
            </div>
          ),
        }))}
      />
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

import { InfoBox } from "@/components/InfoBox";
import { LiensCTA } from "@/components/LiensCTA";
import { Standings } from "@/components/Standings";

import { portefeuilles_ministeriels } from "@/data/monde.json";

export default function PortefeuillesMinisterielsPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-6xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-x-10 items-center px-5">
        <div className="flex-4 lg:flex-1">
          <h2 className="header-h3 text-foundations-violet-principal">
            Le top 5 des portefeuilles ministériels occupés par des femmes dans
            le monde
          </h2>
          <div className="h-5" />
          <Standings data={portefeuilles_ministeriels.top5} thumbsUpTop={5} />
          <div className="h-5" />

          <h2 className="header-h3 text-foundations-violet-principal">
            Le top 5 des portefeuilles ministériels les moins féminisés
          </h2>
          <div className="h-5" />
          <Standings
            data={portefeuilles_ministeriels.bottom5}
            thumbsDownBottom={5}
          />
        </div>
        <div className="flex-1 mt-10 lg:mt-0 lg:flex-1 flex flex-col items-center lg:flex-row gap-10 md:gap-15">
          <LiensCTA />
          <InfoBox>
            L’attribution des portefeuilles ministériels reste genrée. En effet,
            les femmes ont particulièrement la charge de thématiques liées aux
            droits des femmes et au « care ».
          </InfoBox>
        </div>
      </div>
    </div>
  );
}

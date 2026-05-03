import { InfoBox } from "@/components/InfoBox";
import { LiensCTA, sourceURLs } from "@/components/LiensCTA";
import { Standings } from "@/components/Standings";

export default function PortefeuillesMinisterielsPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row gap-x-10 items-center px-5">
        <div className="flex-4 md:flex-1">
          <h2 className="header-h3 text-foundations-violet-principal">
            Le top 5 des portefeuilles ministériels occupés par des femmes dans
            le monde
          </h2>
          <div className="h-5" />
          <Standings
            data={[
              {
                label: "Femmes et égalité des sexes",
                percentage: 89.7,
                evolution: 3.0,
              },
              {
                label: "Affaires familiales et de l'enfance",
                percentage: 73.5,
                evolution: 2.1,
              },
              {
                label: "Affaires sociales (général)",
                percentage: 56.3,
                evolution: 12.9,
              },
              {
                label: "Inclusion sociale et développement",
                percentage: 55.4,
                evolution: -0.2,
              },
              {
                label: "Protection sociale et sécurité sociale",
                percentage: 39.9,
                evolution: -2.2,
              },
            ]}
          />
          <div className="h-5" />

          <h2 className="header-h3 text-foundations-violet-principal">
            Le top 5 des portefeuilles ministériels les moins féminisés
          </h2>
          <div className="h-5" />
          <Standings
            data={[
              {
                label: "Affaires religieuses",
                percentage: 6.4,
                evolution: 4.1,
              },
              { label: "Transport", percentage: 9.7, evolution: -3.1 },
              {
                label: "Affaires intérieures",
                percentage: 11.1,
                evolution: -2.1,
              },
              {
                label: "Énergie, combustibles naturels et mines",
                percentage: 11.8,
                evolution: -0.6,
              },
              { label: "Défense", percentage: 12.2, evolution: -0.8 },
            ]}
          />
        </div>
        <div className="h-10 md:hidden" />
        <div className="flex-1 md:flex-1 flex flex-row gap-x-5 md:gap-x-15">
          <LiensCTA downloadURL={sourceURLs.monde.portefeuilles_ministeriels} />
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

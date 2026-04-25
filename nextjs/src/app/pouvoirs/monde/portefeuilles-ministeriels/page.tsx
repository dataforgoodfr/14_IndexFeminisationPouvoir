import { InfoBox } from '@/components/InfoBox';
import { LiensCTA } from '@/components/LiensCTA';
import { ShortDate } from "@/components/ShortDate";
import { Standings } from '@/components/Standings';

export default function PortefeuillesMinisterielsPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row gap-x-10 items-center px-5">
        <div className="flex-4 md:flex-1">
          <h2 className="header-h3 text-foundations-violet-principal">
            Le top 5 des portefeuilles ministériels occupés par des femmes dans le monde
          </h2>
          <div className="h-5" />
          <Standings data={[
            {
              label: "Femmes et égalité des sexes ",
              percentage: 14,
              evolution: -100
            },
            {
              label: "Affaires familiales et enfance",
              percentage: 14,
              evolution: 100
            },
            {
              label: "Inclusion sociale et développement",
              percentage: 14,
              evolution: -100
            },
            {
              label: "Affaire sociale",
              percentage: 14,
              evolution: -100
            },
            {
              label: "Protection sociale et sécurité sociale",
              percentage: 14,
              evolution: 100
            },
          ]} />
          <div className="h-5" />

          <h2 className="header-h3 text-foundations-violet-principal">
            Le top 5 des portefeuilles ministériels les moins féminisés
          </h2>
          <div className="h-5" />
          <Standings data={[
            {
              label: "Les affaires religieuses",
              percentage: 14,
              evolution: -100
            },
            {
              label: "Energie, combustibles naturels et mines",
              percentage: 14,
              evolution: 100
            },
            {
              label: "Transport",
              percentage: 14,
              evolution: -100
            },
            {
              label: "Défense",
              percentage: 14,
              evolution: -100
            },
            {
              label: "Affaires intérieures",
              percentage: 14,
              evolution: 100
            },
          ]} />
        </div>
        <div className="h-10 md:hidden" />
        <div className="flex-1 md:flex-1 flex flex-row gap-x-5 md:gap-x-15">
          <LiensCTA />
          <InfoBox>
            L’attribution des portefeuilles ministériels reste genrée.

            En effet, les femmes ont particulièrement la charge de thématiques liées aux droits des femmes et au « care ».
          </InfoBox>
        </div>
      </div>
    </div>
  );
}

import { Hero } from "@/components/Hero";
import { AmbassadesIcon } from "@/components/icons/ambassades";
import { GlobeIcon } from "@/components/icons/globe";
import { PaysAvecFemmeIcon } from "@/components/icons/pays-avec-femme";
import { PortefeuillesMinisterielsIcon } from "@/components/icons/portefeuilles-ministeriels";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { SectionGroup } from "@/components/SectionGroup";
import { PageTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { score, dateMiseAJour, annee } = pouvoirData.autre;

export default function DansLeMondeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTitle
        id="monde"
        title="Dans le monde"
        subtitle="Dans l’index de la féminisation du pouvoir, Oxfam a analysé les sphères de pouvoirs à l’échelle mondiale"
      />

      <SectionGroup
        navItems={[
          {
            href: "/pouvoirs/monde",
            label: "Pays avec une femme",
            icon: <PaysAvecFemmeIcon className="w-20 h-20" />,
          },
          {
            href: "/pouvoirs/monde/portefeuilles-ministeriels",
            label: "Portefeuilles Ministeriels",
            icon: <PortefeuillesMinisterielsIcon className="w-20 h-20" />,
          },
          {
            href: "/pouvoirs/monde/union-europeenne",
            label: "Union Européenne",
            // TODO:
            icon: <PaysAvecFemmeIcon className="w-20 h-20" />,
          },
        ]}
        banner={
          <Hero>
            <PouvoirFigureXL
              valeur={score}
              icon={GlobeIcon}
              dateMiseAJour={new Date(dateMiseAJour)}
              annee={annee}
              intitule="Ministres dans le monde"
            />
          </Hero>
        }
      >
        <div className="mb-32">{children}</div>
      </SectionGroup>
    </>
  );
}

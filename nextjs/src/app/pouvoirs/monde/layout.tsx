import { Hero } from "@/components/Hero";
import { AmbassadesIcon } from "@/components/icons/ambassades";
import { AutresPouvoirIcon } from "@/components/icons/autres-pouvoirs";
import { HauteAutoritéIcon } from "@/components/icons/haute-autorite";
import { HautesJuridictionsIcon } from "@/components/icons/hautes-juridictions";
import { PartisPolitiquesIcon } from "@/components/icons/partis-politiques";
import { PréfecturesIcon } from "@/components/icons/prefectures";
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
            icon: <HautesJuridictionsIcon className="w-20 h-20" />,
          },
          {
            href: "/pouvoirs/monde/portefeuilles-ministeriels",
            label: "Portefeuilles Ministeriels",
            icon: <PréfecturesIcon className="w-20 h-20" />,
          },
          {
            href: "/pouvoirs/monde/union-europeenne",
            label: "Union Européenne",
            icon: <AmbassadesIcon className="w-20 h-20" />,
          }
        ]}
        banner={
          <Hero>
            <PouvoirFigureXL
              valeur={score}
              icon={AutresPouvoirIcon}
              dateMiseAJour={new Date(dateMiseAJour)}
              annee={annee}
              prelabel=""
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

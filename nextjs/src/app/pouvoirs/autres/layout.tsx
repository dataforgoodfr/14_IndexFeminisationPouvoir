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

export default function AutresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTitle
        id="autres-pouvoirs"
        title="Autres pouvoirs"
        subtitle="Dans l'index de la féminisation du pouvoir, Oxfam a analysé d'autres niveaux décisionnaires et hauts corps de l'État représentant des sphères de pouvoir en France."
      />

      <SectionGroup
        navItems={[
          {
            href: "/pouvoirs/autres",
            label: "Hautes juridictions",
            icon: <HautesJuridictionsIcon className="w-20 h-20" />,
          },
          {
            href: "/pouvoirs/autres/prefectures",
            label: "Préfectures",
            icon: <PréfecturesIcon className="w-20 h-20" />,
          },
          {
            href: "/pouvoirs/autres/ambassades",
            label: "Ambassades",
            icon: <AmbassadesIcon className="w-20 h-20" />,
          },
          {
            href: "/pouvoirs/autres/haute-autorite",
            label: "Haute autorité / Agences de l'état",
            icon: <HauteAutoritéIcon className="w-20 h-20" />,
          },
          {
            href: "/pouvoirs/autres/partis-politiques",
            label: "Partis politiques",
            icon: <PartisPolitiquesIcon className="w-20 h-20" />,
          },
        ]}
        banner={
          <Hero>
            <PouvoirFigureXL
              valeur={score}
              icon={AutresPouvoirIcon}
              dateMiseAJour={new Date(dateMiseAJour)}
              annee={annee}
              prelabel="au sein des"
              intitule="autres pouvoirs"
            />
          </Hero>
        }
      >
        <div className="mb-32">{children}</div>
      </SectionGroup>
    </>
  );
}

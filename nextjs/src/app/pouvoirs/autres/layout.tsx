import type { Route } from "next";
import { Hero } from "@/components/Hero";
import { AmbassadesIcon } from "@/components/icons/ambassades";
import { AutresPouvoirIcon } from "@/components/icons/autres-pouvoirs";
import { HauteAutoritéIcon } from "@/components/icons/haute-autorite";
import { HautesJuridictionsIcon } from "@/components/icons/hautes-juridictions";
import { PartisPolitiquesIcon } from "@/components/icons/partis-politiques";
import { PréfecturesIcon } from "@/components/icons/prefectures";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { SectionNavigation } from "@/components/SectionNavigation";
import { PageTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { score } = pouvoirData.autre;

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
      <Hero>
        <PouvoirFigureXL
          valeur={score}
          icon={AutresPouvoirIcon}
          dateMiseAJour={new Date("2025-01-01")}
          intitule="au sein des autres pouvoirs"
        />
      </Hero>
      <nav className="bg-foundations-violet-principal flex flex-wrap justify-center gap-4 px-4 pb-6">
        <SectionNavigation
          href="/pouvoirs/autres"
          label="Hautes juridictions"
          icon={<HautesJuridictionsIcon className="w-20 h-20" />}
        />
        <SectionNavigation
          href={"/pouvoirs/autres/prefectures" as Route}
          label="Préfectures"
          icon={<PréfecturesIcon className="w-20 h-20" />}
        />
        <SectionNavigation
          href={"/pouvoirs/autres/ambassades" as Route}
          label="Ambassades"
          icon={<AmbassadesIcon className="w-20 h-20" />}
        />
        <SectionNavigation
          href={"/pouvoirs/autres/haute-autorite" as Route}
          label="Haute autorité / Agences de l'état"
          icon={<HauteAutoritéIcon className="w-20 h-20" />}
        />
        <SectionNavigation
          href={"/pouvoirs/autres/partis-politiques" as Route}
          label="Partis politiques"
          icon={<PartisPolitiquesIcon className="w-20 h-20" />}
        />
      </nav>
      {children}
    </>
  );
}

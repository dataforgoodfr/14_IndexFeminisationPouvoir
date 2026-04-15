import { Hero } from "@/components/Hero";
import { AutresPouvoirsIcon } from "@/components/icons/pouvoir-autres";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { PageTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";
import { AutresTabs } from "./AutresTabs";

const { score, annee, composantes } = pouvoirData.autre;

export default function Page() {
  return (
    <>
      <PageTitle
        title="Autres pouvoirs"
        subtitle="Dans l'index de la féminisation du pouvoir, Oxfam a analysé d'autres niveaux décisionnaires et hauts corps de l'État représentant des sphères de pouvoir en France."
      />
      <Hero>
        <PouvoirFigureXL
          valeur={score}
          icon={AutresPouvoirsIcon}
          dateMiseàJour={new Date("2025-01-01")}
          intitule="au sein des autres pouvoirs"
          annee={annee}
        />
      </Hero>
      <AutresTabs composantes={composantes} />
    </>
  );
}

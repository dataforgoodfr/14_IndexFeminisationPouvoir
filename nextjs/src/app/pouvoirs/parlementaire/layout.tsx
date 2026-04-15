import { Hero } from "@/components/Hero";
import { AssembleeNationaleIcon } from "@/components/icons/assemblee-nationale";
import { ParlementEuropéenIcon } from "@/components/icons/parlement-euro";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";
import { SénatIcon } from "@/components/icons/senat";
import { NavigationParlementaireSection } from "@/components/NavigationParlementaireSection";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { PageTitle } from "@/components/titles";
import { parlementaire } from "@/data/pouvoir.json";

const {
  composantes: { assemblee_nationale, europeen, senat },
  score,
} = parlementaire;
export default function PouvoirLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="contents" data-current-pouvoir="parlementaire">
      <PageTitle title="Pouvoir parlementaire" subtitle="Texte à ajouter" />
      <Hero>
        <PouvoirFigureXL
          valeur={score}
          icon={PouvoirParlementaireIcon}
          dateMiseàJour={new Date()}
          prelabel="au sein des"
          intitule="parlements"
        />
      </Hero>
      <h2
        className="header-h2 text-foundations-violet-principal"
        id="cabinet-premier-ministre"
      >
        Taux de parité parlementaire
      </h2>
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-4 mb-16">
        <div className="flex-1 flex flex-col">
          <PouvoirFigureL
            intitule="députées"
            valeur={assemblee_nationale.score}
            annee={assemblee_nationale.annee}
            evolution={assemblee_nationale.evolution}
            withChart
          />
        </div>
        <div className="divider-dashed" />
        <div className="flex-1 flex flex-col">
          <PouvoirFigureL
            intitule="sénatrices"
            valeur={senat.score}
            annee={senat.annee}
            evolution={senat.evolution}
            withChart
          />
        </div>
        <div className="divider-dashed" />
        <div className="flex-1 flex flex-col">
          <PouvoirFigureL
            intitule="députées européennes"
            valeur={europeen.score}
            annee={europeen.annee}
            evolution={europeen.evolution}
            withChart
          />
        </div>
      </div>

      <NavigationParlementaireSection
        navItems={[
          {
            label: "Assemblée Nationale",
            href: "/pouvoirs/parlementaire/assemblee-nationale",
            icon: <AssembleeNationaleIcon />,
            parlementKey: "assemblee-nationale",
          },
          {
            label: "Sénat",
            href: "/pouvoirs/parlementaire/senat",
            icon: <SénatIcon />,
            parlementKey: "senat",
          },
          {
            label: "Parlement Européen",
            href: "/pouvoirs/parlementaire/parlement-europeen",
            icon: <ParlementEuropéenIcon />,
            parlementKey: "parlement-europeen",
          },
        ]}
      >
        {children}
      </NavigationParlementaireSection>
    </div>
  );
}

import { Hero } from "@/components/Hero";
import { AssembleeNationaleIcon } from "@/components/icons/assemblee-nationale";
import { ParlementEuropéenIcon } from "@/components/icons/parlement-euro";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";
import { SénatIcon } from "@/components/icons/senat";
import { NavigationParlementaireSection } from "@/components/NavigationParlementaireSection";
import { PageTitle } from "@/components/PageTitle";
import { PouvoirFigure } from "@/components/PouvoirFigure";
import { PouvoirFigureMini } from "@/components/PouvoirFigureMini";
import { parlementaire } from "@/data/pouvoir.json";

const {
  composantes: { assemblee_nationale },
  score,
  annee,
} = parlementaire;
export default function PouvoirLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageTitle title="Pouvoir parlementaire" subtitle="Texte à ajouter" />
      <Hero>
        <PouvoirFigure
          valeur={score}
          icon={PouvoirParlementaireIcon}
          dateMiseàJour={new Date()}
          texte="Texte à ajouter"
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
          <PouvoirFigureMini
            valeur={assemblee_nationale.score}
            label="députées"
            annee={annee}
            evolution={assemblee_nationale.evolution}
          />
        </div>
        <div className="hidden lg:block border-l-2 border-dashed border-foundations-violet-principal" />
        <div className="flex-1 flex flex-col">
          <PouvoirFigureMini
            valeur={assemblee_nationale.score}
            label="députées"
            annee={annee}
            evolution={assemblee_nationale.evolution}
          />
        </div>
        <div className="hidden lg:block border-l-2 border-dashed border-foundations-violet-principal" />
        <div className="flex-1 flex flex-col">
          <PouvoirFigureMini
            valeur={assemblee_nationale.score}
            label="députées"
            annee={annee}
            evolution={assemblee_nationale.evolution}
          />
        </div>
      </div>

      <NavigationParlementaireSection
        navItems={[
          {
            label: "Assemblée Nationale",
            href: "/pouvoirs/parlementaire/assemblee-nationale",
            icon: <AssembleeNationaleIcon />,
          },
          {
            label: "Sénat",
            href: "/pouvoirs/parlementaire/senat",
            icon: <SénatIcon />,
          },
          {
            label: "Parlement Européen",
            href: "/pouvoirs/parlementaire/parlement-europeen",
            icon: <ParlementEuropéenIcon />,
          },
        ]}
      >
        {children}
      </NavigationParlementaireSection>
    </>
  );
}

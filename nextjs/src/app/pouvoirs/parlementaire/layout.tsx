import Link from "next/link";
import { Hero } from "@/components/Hero";
import { AssembleeNationaleIcon } from "@/components/icons/assemblee-nationale";
import { ParlementEuropéenIcon } from "@/components/icons/parlement-euro";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";
import { SénatIcon } from "@/components/icons/senat";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { SectionGroup } from "@/components/SectionGroup";
import { TitreBadge } from "@/components/TitreBadge";
import { PageTitle } from "@/components/titles";
import { parlementaire } from "@/data/pouvoir.json";

const {
  composantes: { assemblee_nationale, europeen, senat },
  score,
  annee,
  dateMiseAJour,
} = parlementaire;
export default function PouvoirLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageTitle
        id="pouvoir-parlementaire"
        title="Pouvoir parlementaire"
        subtitle="Dans l'index de la féminisation du pouvoir, Oxfam a analysé 3 niveaux de pouvoirs parlementaires : l'Assemblée Nationale, le Sénat et le Parlement Européen"
      />
      <Hero>
        <PouvoirFigureXL
          valeur={score}
          icon={PouvoirParlementaireIcon}
          annee={annee}
          dateMiseAJour={new Date(dateMiseAJour)}
          prelabel="au sein des"
          intitule="parlements"
        />
      </Hero>
      <h2
        className="header-h2 text-foundations-violet-principal text-center"
        id="cabinet-premier-ministre"
      >
        Taux de parité parlementaire
      </h2>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-4 mb-16 px-16">
        <div className="flex-1 flex flex-col items-center gap-12">
          <Link href={"/pouvoirs/parlementaire"}>
            <TitreBadge
              titre="Assemblée Nationale"
              className="shrink-0 w-fit px-10"
            />
          </Link>

          <PouvoirFigureL
            intitule="députées"
            valeur={assemblee_nationale.score}
            annee={assemblee_nationale.annee}
            evolution={assemblee_nationale.evolution}
            withChart
          />
        </div>
        <div className="flex-1 flex flex-col items-center gap-12">
          <Link href={"/pouvoirs/parlementaire/senat"}>
            <TitreBadge titre="Sénat" className="shrink-0 w-fit px-10" />
          </Link>

          <div className="divider-dashed h-full lg:pl-6">
            <PouvoirFigureL
              intitule="sénatrices"
              valeur={senat.score}
              annee={senat.annee}
              evolution={senat.evolution}
              withChart
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-12">
          <Link href={"/pouvoirs/parlementaire/parlement-europeen"}>
            <TitreBadge
              titre="Parlement Européen"
              className="shrink-0 w-fit px-10"
            />
          </Link>
          <div className="divider-dashed h-full lg:pl-6">
            <PouvoirFigureL
              intitule="députées européennes"
              valeur={europeen.score}
              annee={europeen.annee}
              evolution={europeen.evolution}
              withChart
            />
          </div>
        </div>
      </div>

      <SectionGroup
        navItems={[
          {
            label: "Assemblée Nationale",
            href: "/pouvoirs/parlementaire",
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
        banner={
          <div className="w-full bg-foundations-violet-principal h-28 flex items-center lg:items-start lg:py-6 justify-center">
            <div className="body4-medium text-foundations-blanc">
              Les chiffres en détails
            </div>
          </div>
        }
      >
        {children}
      </SectionGroup>
    </>
  );
}

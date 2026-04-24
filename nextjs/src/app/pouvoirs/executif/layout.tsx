import { Hero } from "@/components/Hero";
import { DirectriceCabinetIcon } from "@/components/icons/directrice-cabinet";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { SectionGroup } from "@/components/SectionGroup";
import { PageTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { score, annee, dateMiseAJour } = pouvoirData.executif;

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTitle
        id="pouvoir-executif"
        title="Pouvoir exécutif"
        subtitle="Le pouvoir exécutif regroupe la présidence de la République, son cabinet, le cabinet du Premier ministre, les ministères régaliens et les cabinets ministériels."
      />

      <SectionGroup
        navItems={[
          {
            label: "Dirigeantes de cabinets au gouvernement",
            href: "/pouvoirs/executif#cabinet-gouvernement",
            icon: <DirectriceCabinetIcon className="w-20.25 h-18.75" />,
          },
          {
            label: "Cabinet du premier ministre",
            href: "/pouvoirs/executif/cabinet-premier-ministre#cabinet-premier-ministre",
            icon: <DirectriceCabinetIcon className="w-20.25 h-18.75" />,
          },
          {
            label: "Cabinet du président de la république",
            href: "/pouvoirs/executif/cabinet-president#cabinet-president",
            icon: <DirectriceCabinetIcon className="w-20.25 h-18.75" />,
          },
          {
            label: "Postes régaliens",
            href: "/pouvoirs/executif/postes-regaliens#postes-regaliens",
            icon: <DirectriceCabinetIcon className="w-20.25 h-18.75" />,
          },
          {
            label: "Femmes au gouvernement",
            href: "/pouvoirs/executif/gouvernement#femmes-au-gouvernement",
            icon: <DirectriceCabinetIcon className="w-20.25 h-18.75" />,
          },
        ]}
        banner={
          <Hero>
            <PouvoirFigureXL
              valeur={score}
              icon={PouvoirExecutifIcon}
              dateMiseAJour={new Date(dateMiseAJour)}
              annee={annee}
              prelabel="au sein du"
              intitule="pouvoir exécutif"
            />
          </Hero>
        }
      >
        <div className="mb-32">{children}</div>
      </SectionGroup>
    </>
  );
}

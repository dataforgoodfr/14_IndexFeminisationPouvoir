import type { ComponentType, SVGProps } from "react";
import { Block } from "@/components/Block";
import { InfoBox } from "@/components/InfoBox";
import { ConseilConstitutionnelIcon } from "@/components/icons/conseil-constitutionnel";
import { ConseilEtatIcon } from "@/components/icons/conseil-etat";
import { CourCassationIcon } from "@/components/icons/cour-cassation";
import { CourComptesIcon } from "@/components/icons/cour-comptes";
import { CourJusticeRepubliqueIcon } from "@/components/icons/cour-justice-republique";
import { HautesJuridictionsIcon } from "@/components/icons/hautes-juridictions";
import { JuridictionCard } from "@/components/JuridictionCard";
import { LiensCTA } from "@/components/LiensCTA";
import { PersonGrid } from "@/components/PersonGrid";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureRelative } from "@/components/PouvoirFigureRelative";
import { PouvoirFigureS } from "@/components/PouvoirFigureS";
import { ShortDate } from "@/components/ShortDate";
import autresData from "@/data/pouvoir_autres.json";

const { hautes_juridictions: hj } = autresData;
const cc = hj.conseil_constitutionnel;
const mag = hj.magistrature;

const ANNEE = new Date(hj.dateMiseAJour).getFullYear();

const INSTITUTION_ICONS: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  "cour-cassation": CourCassationIcon,
  "conseil-etat": ConseilEtatIcon,
  "conseil-constitutionnel": ConseilConstitutionnelIcon,
  "cour-justice-republique": CourJusticeRepubliqueIcon,
  "cour-comptes": CourComptesIcon,
};

const MAGISTRATURE_FIGURES = [
  {
    valeur: mag.juges.score,
    intitule: "juges",
    evolution: mag.juges.evolution,
  },
  {
    valeur: mag.presidents_tribunal.score,
    intitule: "présidant un tribunal",
    evolution: mag.presidents_tribunal.evolution,
  },
  {
    valeur: mag.procureures_republique.score,
    intitule: "procureures de la République",
    evolution: mag.procureures_republique.evolution,
  },
  {
    valeur: mag.presidents_cour_appel.score,
    intitule: "présidant une cour d'appel",
    evolution: mag.presidents_cour_appel.evolution,
  },
  {
    valeur: mag.procureures_generaux.score,
    intitule: "procureures générales",
    evolution: mag.procureures_generaux.evolution,
  },
];

function MagistratureGridCell({
  children,
  withRightBorder,
  withBottomBorder,
}: {
  children: React.ReactNode;
  withRightBorder?: boolean;
  withBottomBorder?: boolean;
}) {
  return (
    <div className="relative min-w-0 p-6 flex flex-col items-center lg:items-start justify-center">
      {children}

      {withRightBorder && (
        <span className="pointer-events-none absolute right-0 top-1/2 hidden h-[80%] -translate-y-1/2 border-r border-dashed border-foundations-violet-clair lg:block" />
      )}
      {withBottomBorder && (
        <span className="pointer-events-none absolute bottom-0 left-1/2 w-[80%] -translate-x-1/2 border-b border-dashed border-foundations-violet-clair " />
      )}
    </div>
  );
}

export default function HautesJuridictionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-4 py-12 sm:px-6 lg:px-12">
      {/* Section header */}
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h2 text-foundations-violet-principal text-center">
          Hautes juridictions
        </h2>
        <p className="body2-regular text-black">
          Dernière mise à jour : <ShortDate date={new Date(hj.dateMiseAJour)} />
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>

      {/* Overall stat */}
      <div className="w-full max-w-3xl flex flex-col items-center lg:flex-row lg:items-start gap-9">
        <PouvoirFigureL
          valeur={hj.score}
          intitule="présidant les plus hautes juridictions et institutions en charge de l'application et/ou de la conformité de la loi"
          annee={ANNEE}
          evolution={hj.evolution}
          withChart
          icon={HautesJuridictionsIcon}
          chartClassName="w-[164px] h-[164px]"
        />
        <LiensCTA />
      </div>

      {/* Institution cards */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-252">
        {hj.institutions.map((institution) => {
          const Icon = INSTITUTION_ICONS[institution.id];
          if (!Icon) return null;
          return (
            <JuridictionCard
              key={institution.id}
              icon={Icon}
              label={institution.label}
              description={institution.description}
            />
          );
        })}
      </div>

      {/* Detail blocks */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
        {/* Conseil constitutionnel */}
        <Block
          titre="Conseil constitutionnel"
          dateMiseAJour={new Date(cc.dateMiseAJour)}
          className="flex-1 min-w-0"
          cardClassName="pt-20"
        >
          <div className="flex flex-col gap-5">
            <PersonGrid
              femmes={cc.membres_femmes}
              hommes={cc.membres_total - cc.membres_femmes}
            />
            <PouvoirFigureRelative
              femmes={cc.membres_femmes}
              total={cc.membres_total}
              intitule="au conseil constitutionnel"
              annee={ANNEE}
              evolution={cc.evolution}
            />
            <InfoBox>
              <p className="body2-regular">{cc.infobox}</p>
            </InfoBox>
          </div>
        </Block>

        {/* Magistrature */}
        <Block
          titre="Magistrature"
          dateMiseAJour={new Date(mag.dateMiseAJour)}
          className="flex-1 min-w-0"
          cardClassName="px-0"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {MAGISTRATURE_FIGURES.map((figure, index) => {
              const isLastItem = index === MAGISTRATURE_FIGURES.length - 1;
              const isLeftColumn = index % 2 === 0 && !isLastItem;

              return (
                <MagistratureGridCell
                  key={figure.intitule}
                  withBottomBorder={!isLastItem}
                  withRightBorder={isLeftColumn}
                >
                  <PouvoirFigureS
                    valeur={figure.valeur}
                    intitule={figure.intitule}
                    annee={ANNEE}
                    evolution={figure.evolution}
                  />
                </MagistratureGridCell>
              );
            })}
            <MagistratureGridCell>
              <InfoBox>
                <p className="body2-regular">{mag.infobox}</p>
              </InfoBox>
            </MagistratureGridCell>
          </div>
        </Block>
      </div>
    </div>
  );
}

import { Block } from "@/components/Block";
import { InfoBox } from "@/components/InfoBox";
import { JuridictionCard } from "@/components/JuridictionCard";
import { PersonGrid } from "@/components/PersonGrid";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureS } from "@/components/PouvoirFigureS";
import { ConseilConstitutionnelIcon } from "@/components/icons/conseil-constitutionnel";
import { ConseilEtatIcon } from "@/components/icons/conseil-etat";
import { CourCassationIcon } from "@/components/icons/cour-cassation";
import { CourComptesIcon } from "@/components/icons/cour-comptes";
import { CourJusticeRepubliqueIcon } from "@/components/icons/cour-justice-republique";
import { EvolutionBadge } from "@/components/EvolutionBadge";
import type { ComponentType, SVGProps } from "react";
import autresData from "@/data/pouvoir_autres.json";

const { hautes_juridictions: hj } = autresData;
const cc = hj.conseil_constitutionnel;
const mag = hj.magistrature;

const ANNEE = 2025;

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

export default function HautesJuridictionsPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-11 px-4">
      {/* Section header */}
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h1 text-foundations-violet-principal text-center">
          Hautes juridictions
        </h2>
        <p className="body2-regular text-black">
          Dernière mise à jour :{" "}
          {new Date(hj.dateMiseAJour).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>

      {/* Overall stat */}
      <PouvoirFigureL
        valeur={hj.score}
        intitule="présidant les plus hautes juridictions et institutions en charge de l'application et/ou de la conformité de la loi"
        annee={ANNEE}
        evolution={hj.evolution}
        withChart
      />

      {/* Institution cards */}
      <div className="flex flex-wrap gap-8 justify-center">
        {hj.institutions.map((institution) => {
          const Icon = INSTITUTION_ICONS[institution.id];
          return (
            <JuridictionCard
              key={institution.id}
              icon={Icon}
              label={institution.label}
            />
          );
        })}
      </div>

      {/* Detail blocks */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-screen-xl">
        {/* Conseil constitutionnel */}
        <Block
          titre="Conseil constitutionnel"
          dateMiseAJour={new Date(cc.dateMiseAJour)}
          className="flex-1 min-w-0"
        >
          <div className="flex flex-col gap-5">
            <PersonGrid
              femmes={cc.membres_femmes}
              hommes={cc.membres_total - cc.membres_femmes}
            />
            <div className="flex flex-row gap-2 items-start">
              <span
                className="text-chiffre-l text-foundations-violet-principal leading-none"
                style={{ fontFamily: "var(--font-oxfam-tstar-pro)" }}
              >
                {cc.membres_femmes}/{cc.membres_total}
              </span>
              <EvolutionBadge value={cc.evolution} />
              <div className="flex flex-col text-foundations-violet-principal">
                <span className="text-femmes-xl lowercase">de femmes</span>
                <span className="header-h3 uppercase">
                  au conseil constitutionnel
                </span>
                <span className="header-h3 uppercase">en {ANNEE}</span>
              </div>
            </div>
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
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-6 flex-wrap">
              <PouvoirFigureS
                valeur={mag.juges.score}
                intitule="juges"
                annee={ANNEE}
                evolution={mag.juges.evolution}
              />
              <div className="w-px bg-foundations-violet-clair self-stretch hidden lg:block" />
              <PouvoirFigureS
                valeur={mag.presidents_tribunal.score}
                intitule="présidant un tribunal"
                annee={ANNEE}
                evolution={mag.presidents_tribunal.evolution}
              />
            </div>
            <hr className="border-foundations-violet-clair" />
            <div className="flex flex-row gap-6 flex-wrap">
              <PouvoirFigureS
                valeur={mag.procureures_republique.score}
                intitule="procureures de la République"
                annee={ANNEE}
                evolution={mag.procureures_republique.evolution}
              />
              <div className="w-px bg-foundations-violet-clair self-stretch hidden lg:block" />
              <div className="flex flex-col gap-4">
                <PouvoirFigureS
                  valeur={mag.procureures_generaux.score}
                  intitule="procureures généraux"
                  annee={ANNEE}
                  evolution={mag.procureures_generaux.evolution}
                />
                <InfoBox>
                  <p className="body2-regular">{mag.infobox}</p>
                </InfoBox>
              </div>
            </div>
          </div>
        </Block>
      </div>
    </div>
  );
}

import type { ComponentType, SVGProps } from "react";
import { Block } from "@/components/Block";
import { EvolutionBadge } from "@/components/EvolutionBadge";
import { InfoBox } from "@/components/InfoBox";
import { ConseilConstitutionnelIcon } from "@/components/icons/conseil-constitutionnel";
import { ConseilEtatIcon } from "@/components/icons/conseil-etat";
import { CourCassationIcon } from "@/components/icons/cour-cassation";
import { CourComptesIcon } from "@/components/icons/cour-comptes";
import { CourJusticeRepubliqueIcon } from "@/components/icons/cour-justice-republique";
import { HautesJuridictionsIcon } from "@/components/icons/hautes-juridictions";
import { JuridictionCard } from "@/components/JuridictionCard";
import { PersonGrid } from "@/components/PersonGrid";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureS } from "@/components/PouvoirFigureS";
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
    <div className="flex flex-col items-center gap-12 py-11 px-4 max-w-screen-xl mx-auto w-full">
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
      <div className="w-full max-w-3xl">
        <PouvoirFigureL
          valeur={hj.score}
          intitule="présidant les plus hautes juridictions et institutions en charge de l'application et/ou de la conformité de la loi"
          annee={ANNEE}
          evolution={hj.evolution}
          withChart
          icon={HautesJuridictionsIcon}
        />
      </div>

      {/* Institution cards */}
      <div className="flex flex-wrap gap-8 justify-center">
        {hj.institutions.map((institution) => {
          const Icon = INSTITUTION_ICONS[institution.id];
          if (!Icon) return null;
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
          <div className="grid grid-cols-[1fr_auto_1fr]">
            <div className="min-w-0 p-4">
              <PouvoirFigureS
                valeur={mag.juges.score}
                intitule="juges"
                annee={ANNEE}
                evolution={mag.juges.evolution}
              />
            </div>
            <div className="flex items-center px-2">
              <div className="h-30 border-l border-dotted border-foundations-violet-clair" />
            </div>
            <div className="min-w-0 p-4">
              <PouvoirFigureS
                valeur={mag.presidents_tribunal.score}
                intitule="présidant un tribunal"
                annee={ANNEE}
                evolution={mag.presidents_tribunal.evolution}
              />
            </div>
            <div className="col-span-3 flex justify-center py-1">
              <div className="w-4/5 border-t border-dotted border-foundations-violet-clair" />
            </div>
            <div className="min-w-0 p-4">
              <PouvoirFigureS
                valeur={mag.procureures_republique.score}
                intitule="procureures de la République"
                annee={ANNEE}
                evolution={mag.procureures_republique.evolution}
              />
            </div>
            <div className="flex items-center px-2">
              <div className="h-30 border-l border-dotted border-foundations-violet-clair" />
            </div>
            <div className="min-w-0 p-4">
              <PouvoirFigureS
                valeur={mag.presidents_cour_appel.score}
                intitule="présidant une cour d'appel"
                annee={ANNEE}
                evolution={mag.presidents_cour_appel.evolution}
              />
            </div>
            <div className="col-span-3 flex justify-center py-1">
              <div className="w-4/5 border-t border-dotted border-foundations-violet-clair" />
            </div>
            <div className="min-w-0 p-4">
              <PouvoirFigureS
                valeur={mag.procureures_generaux.score}
                intitule="procureures généraux"
                annee={ANNEE}
                evolution={mag.procureures_generaux.evolution}
              />
            </div>
            <div className="flex items-center px-2">
              <div className="h-30 border-l border-dotted border-foundations-violet-clair" />
            </div>
            <div className="min-w-0 p-4">
              <InfoBox>
                <p className="body2-regular">{mag.infobox}</p>
              </InfoBox>
            </div>
          </div>
        </Block>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { InfoBox } from "@/components/InfoBox";
import { AutresPouvoirsIcon } from "@/components/icons/pouvoir-autres";
import { ScaleIcon } from "@/components/icons/scale";
import { JuridictionCard } from "@/components/JuridictionCard";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureS } from "@/components/PouvoirFigureS";
import { PouvoirFigureXL } from "@/components/PouvoirFigureXL";
import { PageTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";
import { cn } from "@/lib/utils";

const { score, annee, composantes } = pouvoirData.autre;
const { hautes_juridictions } = composantes;
const { conseil_constitutionnel, magistrature } = hautes_juridictions;

// ---- Icône personne inline (même SVG que GenderDistributionChart) ----
const PersonIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 29 30"
    className={
      filled
        ? "fill-foundations-violet-principal"
        : "fill-foundations-violet-clair"
    }
    aria-hidden="true"
  >
    <g clipPath="url(#clip-person)">
      <path d="M14.2519 14.8786C15.6615 14.8786 17.0394 14.4423 18.2114 13.6249C19.3834 12.8074 20.2969 11.6456 20.8363 10.2862C21.3758 8.92686 21.5169 7.43106 21.2419 5.98798C20.9669 4.54489 20.2881 3.21933 19.2914 2.17893C18.2947 1.13852 17.0248 0.429995 15.6423 0.142948C14.2598 -0.1441 12.8268 0.00322335 11.5246 0.566287C10.2223 1.12935 9.10922 2.08287 8.3261 3.30625C7.54299 4.52964 7.125 5.96796 7.125 7.43931C7.12689 9.41174 7.87836 11.3028 9.21451 12.6975C10.5507 14.0922 12.3623 14.8767 14.2519 14.8786ZM14.2519 2.47977C15.1916 2.47977 16.1102 2.77064 16.8916 3.31561C17.6729 3.86057 18.2819 4.63514 18.6415 5.54138C19.0011 6.44762 19.0952 7.44481 18.9119 8.40687C18.7286 9.36893 18.2761 10.2526 17.6116 10.9462C16.9471 11.6398 16.1005 12.1122 15.1789 12.3036C14.2572 12.4949 13.3019 12.3967 12.4337 12.0213C11.5655 11.646 10.8235 11.0103 10.3014 10.1947C9.7793 9.37909 9.50064 8.42022 9.50064 7.43931C9.50064 6.12396 10.0012 4.86248 10.8923 3.93239C11.7833 3.00229 12.9918 2.47977 14.2519 2.47977Z" />
      <path d="M14.2529 17.3594C11.4186 17.3627 8.70127 18.5394 6.69711 20.6314C4.69296 22.7234 3.56564 25.5598 3.5625 28.5183C3.5625 28.8472 3.68764 29.1625 3.9104 29.3951C4.13316 29.6276 4.43529 29.7582 4.75032 29.7582C5.06535 29.7582 5.36748 29.6276 5.59024 29.3951C5.813 29.1625 5.93814 28.8472 5.93814 28.5183C5.93814 26.2165 6.81416 24.0089 8.37347 22.3812C9.93279 20.7536 12.0477 19.8391 14.2529 19.8391C16.4581 19.8391 18.573 20.7536 20.1323 22.3812C21.6916 24.0089 22.5676 26.2165 22.5676 28.5183C22.5676 28.8472 22.6928 29.1625 22.9155 29.3951C23.1383 29.6276 23.4404 29.7582 23.7554 29.7582C24.0705 29.7582 24.3726 29.6276 24.5954 29.3951C24.8181 29.1625 24.9433 28.8472 24.9433 28.5183C24.9401 25.5598 23.8128 22.7234 21.8087 20.6314C19.8045 18.5394 17.0872 17.3627 14.2529 17.3594Z" />
    </g>
    <defs>
      <clipPath id="clip-person">
        <rect width="28.5077" height="29.7572" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// ---- Types d'onglets ----
type TabId =
  | "hautes_juridictions"
  | "prefectures"
  | "ambassades"
  | "haute_autorite"
  | "partis_politiques";

const TABS: { id: TabId; label: string }[] = [
  { id: "hautes_juridictions", label: "Hautes juridictions" },
  { id: "prefectures", label: "Préfectures" },
  { id: "ambassades", label: "Ambassades" },
  { id: "haute_autorite", label: "Haute autorité\u00a0/ Agences de l'état" },
  { id: "partis_politiques", label: "Partis politiques" },
];

// ---- Panneau avec badge-titre (pattern CollectiviteLocaleBlock) ----
const LabeledPanel = ({
  titre,
  children,
  dateMiseAJour,
}: {
  titre: string;
  children: React.ReactNode;
  dateMiseAJour?: string;
}) => (
  <div className="relative pt-5 pb-2 flex-1 min-w-0">
    <div className="absolute top-0 left-4 -translate-y-1/2 z-10 bg-foundations-violet-principal rounded-md px-10 py-2">
      <span className="header-h3 text-white">{titre}</span>
    </div>
    <div className="bg-white border-2 border-purple-oxfam-100 px-8 py-6 h-full">
      {children}
    </div>
    {dateMiseAJour && (
      <p className="text-right text-xs text-foundations-violet-principal mt-1">
        Dernière mise à jour : {dateMiseAJour}
      </p>
    )}
  </div>
);

// ---- Stub minimal pour les onglets non encore conçus ----
const TabStub = ({ titre }: { titre: string }) => (
  <div className="py-16 flex flex-col items-center gap-4">
    <h2 className="header-h2 text-foundations-violet-principal text-center">
      {titre}
    </h2>
    <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
    <p className="body1-regular text-center text-gray-500 mt-4">
      Données à venir
    </p>
  </div>
);

// ---- Contenu Hautes juridictions ----
const HautesJuridictionsContent = () => (
  <div className="flex flex-col gap-10 py-11 px-8">
    {/* Titre de section */}
    <div className="flex flex-col items-center gap-2">
      <h2 className="header-h2 text-foundations-violet-principal text-center">
        Hautes juridictions
      </h2>
      <p className="label-regular text-foundations-noir">
        Dernière mise à jour : 01/01/2025
      </p>
      <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
    </div>

    {/* Stat principale */}
    <div className="flex justify-center">
      <PouvoirFigureL
        valeur={hautes_juridictions.score}
        intitule="présidant les plus hautes juridictions et institutions en charge de l'application et/ou de la conformité de la loi"
        annee={hautes_juridictions.annee}
        evolution={hautes_juridictions.evolution}
        withChart
      />
    </div>

    {/* Cartes des 5 institutions */}
    <div className="flex flex-wrap gap-8 justify-center">
      <JuridictionCard name="Cour de cassation" />
      <JuridictionCard name="Conseil d'État" />
      <JuridictionCard name="Conseil Constitutionnel" />
      <JuridictionCard
        name="Cour de Justice de la République"
        icon={
          <ScaleIcon className="size-16 fill-foundations-violet-principal" />
        }
      />
      <JuridictionCard name="Cour des comptes" />
    </div>

    {/* Deux panneaux de détail côte à côte */}
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
      {/* Panneau Conseil constitutionnel */}
      <LabeledPanel titre="Conseil constitutionnel" dateMiseAJour="01/01/2025">
        <div className="flex flex-col gap-6">
          {/* 3F + 6M icônes */}
          <div className="flex flex-row gap-3 justify-center">
            {Array.from({ length: conseil_constitutionnel.total }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: icônes statiques à ordre fixe
              <PersonIcon key={i} filled={i < conseil_constitutionnel.femmes} />
            ))}
          </div>
          {/* Stat 1/3 */}
          <div className="flex flex-col">
            <div className="flex flex-row items-start gap-2">
              <span className="text-chiffre-l text-foundations-violet-principal leading-none">
                {conseil_constitutionnel.femmes}/{conseil_constitutionnel.total}
              </span>
            </div>
            <span className="text-femmes-xl lowercase text-foundations-violet-principal">
              de femmes
            </span>
            <span className="header-h3 uppercase text-foundations-violet-principal">
              au conseil constitutionnel
            </span>
            <span className="header-h3 uppercase text-foundations-violet-principal">
              en {conseil_constitutionnel.annee}
            </span>
          </div>
          <InfoBox>
            <p className="body1-regular">
              Le Conseil Constitutionnel n'a jamais été présidé par une femme.
              Depuis sa création en 1959, les femmes représentent seulement
              14&nbsp;% des sages. La première femme à faire son entrée au
              Conseil Constitutionnel était Noëlle Lenoir en 1992.
            </p>
          </InfoBox>
        </div>
      </LabeledPanel>

      {/* Panneau Magistrature */}
      <LabeledPanel titre="Magistrature" dateMiseAJour="01/01/2025">
        <div className="flex flex-col gap-4">
          <div className="border-b border-dashed border-purple-oxfam-300 py-3">
            <PouvoirFigureS
              valeur={magistrature.juges.score}
              intitule="juges"
              annee={magistrature.juges.annee}
              evolution={magistrature.juges.evolution}
            />
          </div>
          <div className="border-b border-dashed border-purple-oxfam-300 py-3">
            <PouvoirFigureS
              valeur={magistrature.president_tribunal.score}
              intitule="présidant un tribunal"
              annee={magistrature.president_tribunal.annee}
              evolution={magistrature.president_tribunal.evolution}
            />
          </div>
          <div className="border-b border-dashed border-purple-oxfam-300 py-3">
            <PouvoirFigureS
              valeur={magistrature.procureures_republique.score}
              intitule="procureures de la République"
              annee={magistrature.procureures_republique.annee}
              evolution={magistrature.procureures_republique.evolution}
            />
          </div>
          <div className="border-b border-dashed border-purple-oxfam-300 py-3">
            <PouvoirFigureS
              valeur={magistrature.president_cour_appel.score}
              intitule="présidant une cour d'appel"
              annee={magistrature.president_cour_appel.annee}
              evolution={magistrature.president_cour_appel.evolution}
            />
          </div>
          <div className="py-3">
            <PouvoirFigureS
              valeur={magistrature.procureures_generaux.score}
              intitule="procureures généraux"
              annee={magistrature.procureures_generaux.annee}
              evolution={magistrature.procureures_generaux.evolution}
            />
          </div>
          <InfoBox>
            <p className="body1-regular">
              Dans le monde de la justice, la magistrature s'est fortement
              féminisée. Néanmoins le plafond de verre persiste.
            </p>
          </InfoBox>
        </div>
      </LabeledPanel>
    </div>
  </div>
);

// ---- Page principale ----
export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>("hautes_juridictions");

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

      {/* Sous-navigation */}
      <div className="flex flex-col lg:flex-row justify-center gap-2 px-4 py-4 bg-foundations-violet-tres-clair">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-4 w-full lg:w-44 rounded-t-md lg:rounded-b-none min-h-20 relative transition-colors",
                isActive
                  ? "bg-white border-b-4 border-foundations-violet-principal"
                  : "bg-foundations-violet-tres-clair border-l-4 lg:border-l-0 border-foundations-violet-principal hover:bg-foundations-violet-clair",
              )}
            >
              <h4 className="header-h4 text-center">{tab.label}</h4>
              {isActive && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-10 border-r-10 border-t-10 border-l-transparent border-r-transparent border-t-foundations-violet-principal hidden lg:block" />
              )}
            </button>
          );
        })}
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="w-full">
        {activeTab === "hautes_juridictions" && <HautesJuridictionsContent />}
        {activeTab === "prefectures" && <TabStub titre="Préfectures" />}
        {activeTab === "ambassades" && <TabStub titre="Ambassades" />}
        {activeTab === "haute_autorite" && (
          <TabStub titre="Haute autorité / Agences de l'état" />
        )}
        {activeTab === "partis_politiques" && (
          <TabStub titre="Partis politiques" />
        )}
      </div>
    </>
  );
}

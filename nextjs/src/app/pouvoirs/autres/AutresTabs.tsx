/** biome-ignore-all lint/suspicious/noArrayIndexKey: pas d'autre clé que l'index, acceptable car non dynamique */
"use client";

import Image from "next/image";
import { useState } from "react";
import { Block } from "@/components/Block";
import { InfoBox } from "@/components/InfoBox";
import { ConseilConstitutionnelIcon } from "@/components/icons/conseil-constitutionnel";
import { ConseilEtatIcon } from "@/components/icons/conseil-etat";
import { CourCassationIcon } from "@/components/icons/cour-cassation";
import { CourComptesIcon } from "@/components/icons/cour-comptes";
import { CourJusticeRepubliqueIcon } from "@/components/icons/cour-justice-republique";
import { FemmeIcon } from "@/components/icons/femme";
import { HommeIcon } from "@/components/icons/homme";
import { JuridictionCard } from "@/components/JuridictionCard";
import { PouvoirFigureL } from "@/components/PouvoirFigureL";
import { PouvoirFigureS } from "@/components/PouvoirFigureS";
import type pouvoirData from "@/data/pouvoir.json";
import { cn } from "@/lib/utils";

type AutreComposantes = (typeof pouvoirData)["autre"]["composantes"];

// ---- Types d'onglets ----
type TabId =
  | "hautes_juridictions"
  | "prefectures"
  | "ambassades"
  | "haute_autorite"
  | "partis_politiques";

const TABS: { id: TabId; label: string; illustration?: string }[] = [
  {
    id: "hautes_juridictions",
    label: "Hautes juridictions",
    illustration: "/images/juridictions/tab-hautes-juridictions.png",
  },
  { id: "prefectures", label: "Préfectures" },
  { id: "ambassades", label: "Ambassades" },
  { id: "haute_autorite", label: "Haute autorité\u00a0/ Agences de l'état" },
  { id: "partis_politiques", label: "Partis politiques" },
];

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
// TODO: les valeurs de score et d'évolution dans pouvoir.json sont des données
// provisoires en attente des chiffres définitifs. À mettre à jour avant mise en prod.
const HautesJuridictionsContent = ({
  data,
}: {
  data: AutreComposantes["hautes_juridictions"];
}) => {
  const { conseil_constitutionnel, magistrature } = data;

  return (
    <div className="flex flex-col gap-10 py-11 px-8">
      {/* Titre de section */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="header-h2 text-foundations-violet-principal text-center">
          Hautes juridictions
        </h2>
        <p className="label-regular text-foundations-noir">
          Dernière mise à jour :{" "}
          {new Date(data.dateMiseAJour).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>

      {/* Stat principale */}
      <div className="flex justify-center">
        <PouvoirFigureL
          valeur={data.score}
          intitule="présidant les plus hautes juridictions et institutions en charge de l'application et/ou de la conformité de la loi"
          annee={data.annee}
          evolution={data.evolution}
          withChart
        />
      </div>

      {/* Cartes des 5 institutions */}
      <div className="flex flex-wrap gap-8 justify-center">
        <JuridictionCard
          name="Cour de cassation"
          icon={<CourCassationIcon className="size-16" />}
        />
        <JuridictionCard
          name="Conseil d'État"
          icon={<ConseilEtatIcon className="size-16" />}
        />
        <JuridictionCard
          name="Conseil Constitutionnel"
          icon={<ConseilConstitutionnelIcon className="size-16" />}
        />
        <JuridictionCard
          name="Cour de Justice de la République"
          icon={<CourJusticeRepubliqueIcon className="size-16" />}
        />
        <JuridictionCard
          name="Cour des comptes"
          icon={<CourComptesIcon className="size-16" />}
        />
      </div>

      {/* Deux panneaux de détail côte à côte */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Panneau Conseil constitutionnel */}
        <Block
          titre="Conseil constitutionnel"
          dateMiseAJour={new Date(conseil_constitutionnel.dateMiseAJour)}
          className="flex-1 min-w-0"
          cardClassName="px-8 py-6 h-full"
        >
          <div className="flex flex-col gap-6">
            {/* Icônes genrées : femmes (robe) puis hommes */}
            <div
              role="img"
              aria-label={`${conseil_constitutionnel.femmes} femmes et ${conseil_constitutionnel.total - conseil_constitutionnel.femmes} hommes au Conseil Constitutionnel`}
              className="flex flex-row gap-3 justify-center"
            >
              {Array.from({ length: conseil_constitutionnel.total }, (_, i) =>
                i < conseil_constitutionnel.femmes ? (
                  <FemmeIcon key={i} className="h-12 w-auto" />
                ) : (
                  <HommeIcon key={i} className="h-12 w-auto" />
                ),
              )}
            </div>
            {/* Stat fraction */}
            <div className="flex flex-col">
              <span className="text-chiffre-l text-foundations-violet-principal leading-none">
                {conseil_constitutionnel.fraction}
              </span>
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
        </Block>

        {/* Panneau Magistrature — grille 2 colonnes */}
        <Block
          titre="Magistrature"
          dateMiseAJour={new Date(magistrature.dateMiseAJour)}
          className="flex-1 min-w-0"
          cardClassName="px-8 py-6 h-full"
        >
          <div className="grid grid-cols-2 gap-x-6">
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
            <div className="py-3">
              <InfoBox>
                <p className="body1-regular">
                  Dans le monde de la justice, la magistrature s'est fortement
                  féminisée. Néanmoins le plafond de verre persiste.
                </p>
              </InfoBox>
            </div>
          </div>
        </Block>
      </div>
    </div>
  );
};

// ---- Composant principal (client uniquement pour l'état des onglets) ----
export const AutresTabs = ({
  composantes,
}: {
  composantes: AutreComposantes;
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("hautes_juridictions");

  return (
    <>
      {/* Sous-navigation */}
      <div
        role="tablist"
        aria-label="Catégories des autres pouvoirs"
        className="flex flex-col lg:flex-row justify-center gap-2 px-4 py-4"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-4 w-full lg:w-44 rounded-t-md lg:rounded-b-none min-h-20 relative transition-colors",
                isActive
                  ? "bg-white border-b-4 border-foundations-violet-principal"
                  : "bg-foundations-violet-tres-clair border-l-4 lg:border-l-0 border-foundations-violet-principal hover:bg-foundations-violet-clair",
              )}
            >
              {isActive && tab.illustration && (
                <Image
                  src={tab.illustration}
                  alt=""
                  width={80}
                  height={40}
                  className="h-10 w-auto mb-1 object-contain"
                />
              )}
              <h4 className="header-h4 text-center">{tab.label}</h4>
              {isActive && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-10 border-r-10 border-t-10 border-l-transparent border-r-transparent border-t-foundations-violet-principal hidden lg:block" />
              )}
            </button>
          );
        })}
      </div>

      {/* Contenu de l'onglet actif */}
      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
        >
          {tab.id === "hautes_juridictions" && (
            <HautesJuridictionsContent data={composantes.hautes_juridictions} />
          )}
          {tab.id === "prefectures" && <TabStub titre="Préfectures" />}
          {tab.id === "ambassades" && <TabStub titre="Ambassades" />}
          {tab.id === "haute_autorite" && (
            <TabStub titre="Haute autorité / Agences de l'état" />
          )}
          {tab.id === "partis_politiques" && (
            <TabStub titre="Partis politiques" />
          )}
        </div>
      ))}
    </>
  );
};

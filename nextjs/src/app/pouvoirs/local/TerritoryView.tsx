"use client";

import Link from "next/link";
import { DownloadIcon } from "@/components/icons/download";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { PouvoirLocalFigure } from "@/components/PouvoirLocalFigure";
import { DeptMapSVG, RegionWithDeptMapSVG } from "@/components/RegionMapSVG";
import {
  type SliderGroup,
  TerritorySlider,
} from "@/components/TerritorySlider";
import { Tooltip } from "@/components/Tooltip";

interface TerritoryViewProps {
  territoryName: string;
  territoryType: "region" | "departement";
  dataPerZone: Record<string, { percentage: number; evolution: number }>;
  onDepartementClick: (departementName: string) => void;
  sliderGroups?: SliderGroup[];
  sliderTextLabels?: Record<
    string,
    Record<
      string,
      { title: string; largeItems: string[]; smallItems: string[] }
    >
  >;
  sliderGroupKeys?: string[];
  dateMiseAJour?: Date;
}

export function TerritoryView({
  territoryName,
  territoryType,
  dataPerZone,
  onDepartementClick,
  sliderGroups,
  sliderTextLabels,
  sliderGroupKeys,
  dateMiseAJour,
}: TerritoryViewProps) {
  const MapComponent =
    territoryType === "region" ? RegionWithDeptMapSVG : DeptMapSVG;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Bloc Data + MAP + Buttons*/}
      <div className="flex-1 flex md:flex-row flex-col items-stretch justify-center w-full gap-12.5 py-17 md:px-25 px-8">
        {/* Bloc Data */}
        <div className="flex-8 flex flex-col gap-y-1.5">
          <h2 className="header-h2 text-foundations-violet-principal">
            {territoryName}
          </h2>
          <p className="label-regular text-foundations-noir">
            Dernière Mise à jour JJ/MM/AAAA
          </p>
          <div className="bg-foundations-violet-clair rounded-md w-9 h-1.5 mb-5"></div>
          {/* Bloc Stats */}
          <PouvoirLocalFigure
            valeur={41.3}
            evolution={+2.3}
            intitule="au sein des principaux"
            intitule2="executifs locaux"
            annee={2025}
            IconType={territoryType}
          />
        </div>

        <div className="flex-9 flex flex-col items-center justify-center">
          {/* Map of territory */}
          <MapComponent
            dataPerZone={dataPerZone}
            zoneName={territoryName}
            className="md:w-126 md:h-69 w-110 h-55"
            onDepartementClick={onDepartementClick}
          />
        </div>
        <div className="flex-1 flex md:flex-col flex-row items-center justify-center gap-4">
          {/* Buttons */}
          <Link href="/methodologie">
            <Tooltip
              text="Méthode de calcul"
              icon={<QuestionMarkIcon className="w-12.5 h-12.5" />}
            />
          </Link>

          <Link href="/telecharger">
            <Tooltip
              text="Télécharger les données"
              icon={<DownloadIcon className="w-12.5 h-12.5" />}
            />
          </Link>
        </div>
      </div>
      {/* Bloc Slider */}
      <div className="w-full bg-purple-oxfam-50">
        {sliderGroups &&
          sliderTextLabels &&
          sliderGroupKeys &&
          sliderGroups.length > 0 && (
            <TerritorySlider
              groups={sliderGroups}
              textLabels={sliderTextLabels}
              groupKeys={sliderGroupKeys}
              territoryType={territoryType}
              dateMiseAJour={dateMiseAJour}
            />
          )}
      </div>
    </div>
  );
}

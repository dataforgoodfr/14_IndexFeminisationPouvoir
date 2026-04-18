"use client";

import Link from "next/link";
import { DownloadIcon } from "@/components/icons/download";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { PouvoirLocalFigure } from "@/components/PouvoirLocalFigure";
import { DeptMapSVG, RegionWithDeptMapSVG } from "@/components/RegionMapSVG";
import { Tooltip } from "@/components/Tooltip";

interface TerritoryViewProps {
  territoryName: string;
  territoryType: "region" | "departement";
  dataPerZone: Record<string, { percentage: number; evolution: number }>;
  onDepartementClick: (departementName: string) => void;
}

export function TerritoryView({
  territoryName,
  territoryType,
  dataPerZone,
  onDepartementClick,
}: TerritoryViewProps) {
  const MapComponent =
    territoryType === "region" ? RegionWithDeptMapSVG : DeptMapSVG;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Bloc Data + MAP + Buttons*/}
      <div className="flex-1 flex flex-row items-stretch justify-center w-full gap-[50px] py-[68px] px-[100px]">
        {/* Bloc Data */}
        <div className="flex-8 flex flex-col gap-y-[6px]">
          <h2 className="header-h2 text-foundations-violet-principal">
            {territoryName}
          </h2>
          <p className="label-regular text-foundations-noir">
            Dernière Mise à jour JJ/MM/AAAA
          </p>
          <div className="bg-foundations-violet-clair rounded-[6px] w-[36px] h-[6px] mb-5"></div>
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
            className="w-126 h-69"
            onDepartementClick={onDepartementClick}
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-[16px]">
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
      <div className="flex-1 flex flex-row">
        {/* Ici le composant slider */}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { DownloadIcon } from "@/components/icons/download";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { PouvoirLocalFigure } from "@/components/PouvoirLocalFigure";
import { DeptMapSVG, RegionWithDeptMapSVG } from "@/components/RegionMapSVG";
import { ShortDate } from "@/components/ShortDate";
import { Tooltip } from "@/components/Tooltip";

interface TerritoryViewProps {
  territoryName: string;
  territoryType: "region" | "departement";
  dataPerZone: Record<string, { percentage: number; evolution: number }>;
  onDepartementChange: (departementName: string) => void;
  dateMiseAJour: Date;
  annee: number;
}

export function TerritoryView({
  territoryName,
  territoryType,
  dataPerZone,
  onDepartementChange,
  dateMiseAJour,
  annee,
}: TerritoryViewProps) {
  const MapComponent =
    territoryType === "region" ? RegionWithDeptMapSVG : DeptMapSVG;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Bloc Data + MAP + Buttons*/}
      <div className="flex-1 flex flex-row items-stretch justify-center w-full gap-12.5 py-17 px-25">
        {/* Bloc Data */}
        <div className="flex-8 flex flex-col gap-y-1.5">
          <h2 className="header-h2 text-foundations-violet-principal">
            {territoryName}
          </h2>
          <p className="label-regular text-foundations-noir">
            Dernière Mise à jour <ShortDate date={dateMiseAJour} />
          </p>
          <div className="bg-foundations-violet-clair rounded-md w-9 h-1.5 mb-5"></div>
          {/* Bloc Stats */}
          <PouvoirLocalFigure
            valeur={dataPerZone[territoryName]?.percentage || 0}
            evolution={dataPerZone[territoryName]?.evolution}
            prelabel="au sein des principaux"
            intitule="executifs locaux"
            annee={annee}
            IconType={territoryType}
          />
        </div>

        <div className="flex-9 flex flex-col items-center justify-center">
          {/* Map of territory */}
          <MapComponent
            dataPerZone={dataPerZone}
            zoneName={territoryName}
            className="w-126 h-69"
            onDepartementClick={onDepartementChange}
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
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

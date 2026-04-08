"use client";

import { useState, useEffect } from "react";
import { PageTitle } from "@/components/PageTitle";
import { FranceMapSVG, RegionMapSVG } from "@/components/FranceMapSVG";

export default function Page() {
  const [fillColor, setFillColor] = useState("#513893"); // default color

  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-purple-oxfam-600")
      .trim();
    setFillColor(color);
  }, []);

  const regionNameList = [
    "CORSE",
    "CENTRE VAL DE LOIRE",
    "BRETAGNE",
    "BOURGOGNE-FRANCHE-COMTÉ",
    "GRAND EST",
    "OCCITANIE",
    "HAUTS DE FRANCE",
    "AUVERGNE RHONE ALPES",
    "NORMANDIE",
    "PAYS DE LA LOIRE",
    "PROVENCE ALPES COTE D'AZUR",
    "ILE DE FRANCE",
    "NOUVELLE AQUITAINE",
  ];

  const regionDivHtml = regionNameList.map((region) => (
    <div key={region} className="border-1 border-gray-300 rounded-lg m-8">
      <h2 className="text-xl font-bold mb-4 text-center">{region}</h2>
      <RegionMapSVG regionName={region} fillColor={fillColor} />
    </div>
  ));

  return (
    <div>
      <PageTitle title="Pouvoir local" subtitle="Texte à ajouter" />
      <div className="border-1 border-gray-300 rounded-lg m-8">
        <FranceMapSVG fillColor={fillColor} />
      </div>
      {regionDivHtml}
    </div>
  );
}

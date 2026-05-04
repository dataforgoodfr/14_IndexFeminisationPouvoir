"use client";

import { useState } from "react";
import { EvolutionLineChart } from "@/components/charts/EvolutionLineChart";
import evolutionData from "@/data/evolution.json";
import { LiensCTA } from "./LiensCTA";

type FilterKey = keyof typeof evolutionData.indicateurs;

const FILTER_KEYS: FilterKey[] = [
  "gouvernement",
  "postesRegaliens",
  "assembleeNationale",
  "senat",
  "commissionEuropeenne",
];

export function EvolutionSection() {
  const [active, setActive] = useState<FilterKey>("gouvernement");
  const indicateur = evolutionData.indicateurs[active];

  return (
    <section className="bg-foundations-violet-clair flex flex-col items-center gap-10 px-3.5 py-15">
      <h2 className="header-h1 text-foundations-blanc text-center">
        Évolution des indicateurs
      </h2>
      <p className="header-h4 text-foundations-violet-principal text-center">
        Sélectionnez une catégorie pour visualiser les données détaillées
      </p>

      {/* Filter tabs */}
      <div className="flex gap-4 flex-wrap justify-center">
        {FILTER_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`body1-medium cursor-pointer px-4 py-2 border transition-colors ${
              active === key
                ? "bg-foundations-violet-principal text-white border-foundations-violet-principal"
                : "bg-white text-foundations-violet-principal border-foundations-violet-principal"
            }`}
          >
            {evolutionData.indicateurs[key].label}
          </button>
        ))}
      </div>

      {/* Chart subtitle */}
      <p className="body1-medium text-foundations-violet-principal text-center max-w-200">
        {indicateur.chartTitle}
      </p>

      {/* Chart */}
      <div className="w-full max-w-292 overflow-x-auto">
        <div className="min-w-160">
          <EvolutionLineChart
            data={indicateur.data}
            presidents={active !== "commissionEuropeenne" ? evolutionData.presidents : []}
          />
        </div>
      </div>

      {/* Action buttons */}
      <LiensCTA variant="horizontal" />
    </section>
  );
}

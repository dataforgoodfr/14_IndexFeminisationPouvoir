"use client";

import Link from "next/link";
import { useState } from "react";
import { EvolutionLineChart } from "@/components/charts/EvolutionLineChart";
import evolutionData from "@/data/evolution.json";

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
    <section className="bg-foundations-violet-clair flex flex-col items-center gap-[43px] px-[14px] py-[60px]">
      <h2 className="header-h1 text-foundations-violet-principal text-center">
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
            className={`body1-medium cursor-pointer px-4 py-2 rounded-[3.75px] border transition-colors ${
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
      <p className="body1-medium text-foundations-violet-principal text-center max-w-[813px]">
        {indicateur.chartTitle}
      </p>

      {/* Chart */}
      <div className="w-full max-w-[1164px] overflow-x-auto">
        <div className="min-w-[640px]">
          <EvolutionLineChart
            data={indicateur.data}
            presidents={evolutionData.presidents}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-[34px] items-center">
        <Link
          href="/methodologie"
          aria-label="Méthodologie"
          className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-foundations-violet-principal text-white text-xl font-bold border-4 border-foundations-violet-principal"
        >
          ?
        </Link>
        <button
          type="button"
          aria-label="Télécharger les données"
          className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-foundations-violet-principal text-white border-4 border-foundations-violet-principal"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
            <path d="M4 20h16" />
          </svg>
        </button>
      </div>
    </section>
  );
}

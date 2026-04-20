/** biome-ignore-all lint/suspicious/noArrayIndexKey: pas d'autre clé que l'index, acceptable car non dynamique */
"use client";
import type React from "react";
import { FemmeIcon } from "../icons/femme";
import { HommeIcon } from "../icons/homme";
import { TitreBadge } from "../TitreBadge";

interface GenderDistributionChartProps {
  pourcentage: number;
  columns?: number;
  rows?: number;
}

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
  pourcentage,
}) => {
  const columns = 10;
  const rows = 5;
  const filledCount = Math.round((pourcentage * (columns * rows)) / 100);

  const icons = Array.from({ length: columns * rows }, (_, i) =>
    i >= filledCount ? "homme" : "femme",
  );

  return (
    <div className="relative w-full lg:w-auto mt-8 px-8">
      <TitreBadge
        titre="% sur 50 personnes"
        className="lg:absolute lg:-top-8 lg:-left-8 lg:z-10 lg:px-10"
      />
      <div className="bg-white rounded-2xl border border-gray-200 mt-4 py-4 lg:py-8 lg:px-12">
        {/* Chart */}
        <div
          className={`grid grid-cols-5 lg:grid-cols-10 gap-4 lg:gap-12 place-items-center`}
        >
          {icons.map((gender, idx) =>
            gender === "femme" ? (
              <FemmeIcon
                className="fill-foundations-violet-principal w-5.5 h-14"
                key={idx}
              />
            ) : (
              <HommeIcon className="w-5.5 h-14" key={idx} />
            ),
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-4" />

        {/* Legend */}
        <div className="flex items-center justify-center flex-col gap-6 lg:flex-row lg:gap-12">
          <div className="flex items-center gap-4">
            <FemmeIcon className="fill-foundations-violet-principal w-5.5 h-14" />
            <span className="text-gray-800 header-h3">
              {Math.round(pourcentage)} femmes
            </span>
          </div>
          <div className="flex items-center gap-4">
            <HommeIcon className="w-5.5 h-14" />
            <span className="text-gray-800 header-h3">
              {Math.round(100 - pourcentage)} hommes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderDistributionChart;

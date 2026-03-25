/** biome-ignore-all lint/suspicious/noArrayIndexKey: pas d'autre clé que l'index, acceptable car non dynamique */
"use client";
import type React from "react";

interface GenderDistributionChartProps {
  pourcentage: number;
  columns?: number;
  rows?: number;
}

const PersonIcon: React.FC<{ filled?: boolean; title: string }> = ({
  filled,
  title,
}) => {
  return (
    <svg width="29" height="30" viewBox="0 0 29 30" fill="none">
      <title>{title}</title>
      <g clipPath="url(#clip0_5766_3814)">
        <path
          d="M14.2519 14.8786C15.6615 14.8786 17.0394 14.4423 18.2114 13.6249C19.3834 12.8074 20.2969 11.6456 20.8363 10.2862C21.3758 8.92686 21.5169 7.43106 21.2419 5.98798C20.9669 4.54489 20.2881 3.21933 19.2914 2.17893C18.2947 1.13852 17.0248 0.429995 15.6423 0.142948C14.2598 -0.1441 12.8268 0.00322335 11.5246 0.566287C10.2223 1.12935 9.10922 2.08287 8.3261 3.30625C7.54299 4.52964 7.125 5.96796 7.125 7.43931C7.12689 9.41174 7.87836 11.3028 9.21451 12.6975C10.5507 14.0922 12.3623 14.8767 14.2519 14.8786ZM14.2519 2.47977C15.1916 2.47977 16.1102 2.77064 16.8916 3.31561C17.6729 3.86057 18.2819 4.63514 18.6415 5.54138C19.0011 6.44762 19.0952 7.44481 18.9119 8.40687C18.7286 9.36893 18.2761 10.2526 17.6116 10.9462C16.9471 11.6398 16.1005 12.1122 15.1789 12.3036C14.2572 12.4949 13.3019 12.3967 12.4337 12.0213C11.5655 11.646 10.8235 11.0103 10.3014 10.1947C9.7793 9.37909 9.50064 8.42022 9.50064 7.43931C9.50064 6.12396 10.0012 4.86248 10.8923 3.93239C11.7833 3.00229 12.9918 2.47977 14.2519 2.47977Z"
          fill={filled ? "#513893" : "#C9C4E4"}
        />
        <path
          d="M14.2529 17.3594C11.4186 17.3627 8.70127 18.5394 6.69711 20.6314C4.69296 22.7234 3.56564 25.5598 3.5625 28.5183C3.5625 28.8472 3.68764 29.1625 3.9104 29.3951C4.13316 29.6276 4.43529 29.7582 4.75032 29.7582C5.06535 29.7582 5.36748 29.6276 5.59024 29.3951C5.813 29.1625 5.93814 28.8472 5.93814 28.5183C5.93814 26.2165 6.81416 24.0089 8.37347 22.3812C9.93279 20.7536 12.0477 19.8391 14.2529 19.8391C16.4581 19.8391 18.573 20.7536 20.1323 22.3812C21.6916 24.0089 22.5676 26.2165 22.5676 28.5183C22.5676 28.8472 22.6928 29.1625 22.9155 29.3951C23.1383 29.6276 23.4404 29.7582 23.7554 29.7582C24.0705 29.7582 24.3726 29.6276 24.5954 29.3951C24.8181 29.1625 24.9433 28.8472 24.9433 28.5183C24.9401 25.5598 23.8128 22.7234 21.8087 20.6314C19.8045 18.5394 17.0872 17.3627 14.2529 17.3594Z"
          fill={filled ? "#513893" : "#C9C4E4"}
        />
      </g>
      <defs>
        <clipPath id="clip0_5766_3814">
          <rect width="28.5077" height="29.7572" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
  pourcentage,
}) => {
  const columns = 10;
  const rows = 4;
  const filledCount = Math.round((pourcentage * (columns * rows)) / 100);

  const icons = Array.from({ length: columns * rows }, (_, i) =>
    i >= filledCount ? "homme" : "femme",
  );

  // Split into rows
  const rowsArray: ("femme" | "homme")[][] = [];
  for (let i = 0; i < icons.length; i += columns) {
    rowsArray.push(icons.slice(i, i + columns));
  }

  return (
    <div className="w-full lg:w-auto">
      <p className="font-bold opacity-75 ml-2 mb-1 flex flex-col lg:flex-row">
        Représentation visuelle <wbr />
        (sur 100 personnes)
      </p>
      <div className="bg-white rounded-2xl border border-gray-200 py-4 lg:py-8 lg:px-32  mx-auto">
        {/* Chart */}
        <div
          className={`grid grid-cols-5 lg:grid-cols-10 gap-4 lg:gap-8 place-items-center`}
        >
          {icons.map((gender, idx) => (
            <PersonIcon
              key={idx}
              filled={gender === "femme"}
              title={gender === "femme" ? "Femme" : "Homme"}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-4" />

        {/* Legend */}
        <div className="flex items-center justify-center flex-col gap-6 lg:flex-row lg:gap-12">
          <div className="flex items-center gap-2">
            <PersonIcon filled title="Femme" />
            <span className="text-gray-800 font-medium text-base">
              {Math.round(pourcentage)} femmes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PersonIcon title="Homme" />
            <span className="text-gray-800 font-medium text-base">
              {Math.round(100 - pourcentage)} hommes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderDistributionChart;

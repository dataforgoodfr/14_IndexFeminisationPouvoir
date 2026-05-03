"use client";

import { useState } from "react";

type NavigationMondeProps = {
  items: {
    label: string;
    component: React.ReactNode;
  }[];
};

export const NavigationMonde = ({ items }: NavigationMondeProps) => {
  const [active, setActive] = useState(items[0]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 flex-wrap justify-center mb-8">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(item)}
            className={`body1-medium cursor-pointer px-4 py-2 border transition-colors ${
              active.label === item.label
                ? "bg-foundations-violet-principal text-white border-foundations-violet-principal"
                : "bg-white text-foundations-violet-principal border-foundations-violet-principal"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {active.component}
    </div>
  );
};

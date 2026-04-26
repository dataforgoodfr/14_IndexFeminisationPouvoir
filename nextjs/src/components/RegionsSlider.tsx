"use client";

import { useState } from "react";
import { GoodBadExample, GoodBadTitle } from "./GoodBadExample";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons/chevron";

export interface RegionDescription {
  rank: number;
  region: string;
  percentage: number;
  description: string;
}

export interface RegionsDescriptions {
  top5: RegionDescription[];
  bottom5: RegionDescription[];
}

interface RegionsSliderProps {
  regions: RegionDescription[];
  title: string;
  variant: "good" | "bad";
}

export function RegionsSlider({ regions, title, variant }: RegionsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? regions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === regions.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const distance = touchStart - e.changedTouches[0].clientX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  const currentRegion = regions[currentIndex];

  return (
    <GoodBadExample
      variant={variant}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="grid grid-cols-3 grid-rows-3 grid-cols-[1fr_4fr_1fr] grid-rows-[1fr_2fr_1fr] py-[24px] gap-y-[10px] h-full"
    >
      {/* Top Row */}
      <div></div>

      {/* Top Middle: Title */}
      <GoodBadTitle title={title} variant={variant} />

      <div></div>

      {/* Middle Row */}
      {/* Middle Left: Chevron < */}
      <div className="flex items-center justify-center">
        <button
          onClick={handlePrevious}
          type="button"
          className="flex text-foundations-blanc cursor-pointer text-[32px]"
          aria-label="Region précédente"
        >
          <ChevronLeftIcon />
        </button>
      </div>

      {/* Middle Center: Description */}
      <div className="flex ">
        <p className="body2-regular bg-foundations-blanc text-center rounded-md p-7.5 w-full ">
          {currentRegion.description}
        </p>
      </div>

      {/* Middle Right: Chevron > */}
      <div className="flex items-center justify-center">
        <button
          onClick={handleNext}
          type="button"
          className="flex text-foundations-blanc cursor-pointer"
          aria-label="Région suivante"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Bottom Row */}
      <div></div>

      {/* Bottom Middle: Indicator Dots */}
      <div className="flex flex-row gap-x-3.75 items-center justify-center">
        {regions.map((element, index) => (
          <button
            key={element.region}
            onClick={() => setCurrentIndex(index)}
            type="button"
            className={`w-3.75 h-3.75 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-foundations-violet-principal"
                : "bg-foundations-violet-tres-clair hover:bg-purple-oxfam-300"
            }`}
            aria-label={`Aller à la région ${index + 1}`}
          />
        ))}
      </div>

      <div></div>
    </GoodBadExample>
  );
}

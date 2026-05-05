"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons/chevron";
import { PouvoirFigureL } from "./PouvoirFigureL";
import { PouvoirFigureS } from "./PouvoirFigureS";

export interface SliderItem {
  valeur: number | null;
  evolution?: number | null;
  title?: string;
}

export interface SliderData {
  title: string;
  largeItems: SliderItem[];
  smallItems: SliderItem[];
}

export interface TerritorySliderProps {
  sliderDatas: SliderData[];
  dateMiseAJour?: Date;
  annee: number;
}

export function TerritorySlider({
  sliderDatas,
  dateMiseAJour,
  annee,
}: TerritorySliderProps) {
  // Raw value titles (not percentages)
  const rawValueTitles = new Set([
    "Présidente de région",
    "Directrice de cabinet d'un.e président.e de région",
    "Présidente de département",
    "Directrice de cabinet d'un.e président.e de département",
  ]);

  // Helper function to determine if a title is a raw value
  const isRawValue = (title: string): boolean => rawValueTitles.has(title);

  // Helper function to get the correct text for femme/femmes
  const getFemmesText = (valeur: number | null, isRaw: boolean): string => {
    if (!isRaw) return "de femmes";
    return valeur === 1 ? "femme" : "femmes";
  };

  // Helper to split array into rows with stable indices
  const splitIntoRows = (items: SliderItem[], colCount: number) => {
    const rows = [];
    for (let i = 0; i < items.length; i += colCount) {
      rows.push({
        items: items.slice(i, i + colCount),
        startIdx: i,
      });
    }
    return rows;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliderDatas.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === sliderDatas.length - 1 ? 0 : prev + 1));
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

  if (sliderDatas.length === 0) return null;

  const currentSliderData = sliderDatas[currentIndex];
  if (
    !currentSliderData ||
    !currentSliderData.smallItems ||
    !currentSliderData.largeItems
  ) {
    return null;
  }

  // Calculate previous and next indices
  const previousIndex =
    currentIndex === 0 ? sliderDatas.length - 1 : currentIndex - 1;
  const nextIndex =
    currentIndex === sliderDatas.length - 1 ? 0 : currentIndex + 1;

  return (
    <>
      {/* Triangle pointing down */}
      <div className="w-full flex justify-center">
        <div className="border-l-24 border-r-24 border-t-24 border-l-transparent border-r-transparent border-t-foundations-blanc" />
      </div>
      {/* Main slider */}
      <div
        className="flex flex-col items-center justify-center gap-y-[13px] py-[55px] w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-row justify-center items-center gap-x-[30px] px-[16px] w-full">
          {/* Previous button and label */}
          <div className="hidden flex-1 lg:flex flex-col items-end justify-start text-right gap-[2px]">
            <button
              type="button"
              onClick={handlePrevious}
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-purple-oxfam-100 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="w-6 h-6 stroke-foundations-violet-principal" />
            </button>
            <p className="label-medium text-foundations-noir">
              {sliderDatas[previousIndex].title}
            </p>
          </div>
          {/* Content area */}
          <div className="flex-7 flex flex-col items-center justify-start w-full px-[25px] py-[30px] gap-[28px] bg-foundations-blanc">
            {/* Title*/}
            <div className="flex flex-col items-center justify-center gap-y-[10px] w-full">
              <h3 className="header-h3 text-foundations-violet-principal text-center">
                {currentSliderData.title}
              </h3>
              <p className="label-medium text-foundations-noir">
                {`Dernière mise à jour: ${dateMiseAJour?.toLocaleDateString("fr-FR")}` ||
                  `Dernière mise à jour: ${annee}`}
              </p>
              <div className="bg-foundations-violet-clair rounded-md w-9 h-1.5 mb-5" />
            </div>

            {/* Bloc Chiffres */}
            <div className="flex flex-col items-center justify-center gap-y-[16px] w-full">
              {/* Large figures - conditional layout */}
              {currentSliderData.largeItems.length === 1 ? (
                // Single FigureL: centered with separator
                <PouvoirFigureL
                  valeur={currentSliderData.largeItems[0].valeur}
                  intitule={currentSliderData.largeItems[0].title || "Item 1"}
                  evolution={currentSliderData.largeItems[0].evolution}
                  annee={annee}
                  withChart
                />
              ) : (
                // Multiple FigureL: main on left, remaining on right with DONT between
                <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8">
                  {/* Left: Main FigureL */}
                  <PouvoirFigureL
                    valeur={currentSliderData.largeItems[0].valeur}
                    intitule={currentSliderData.largeItems[0].title || "Item 1"}
                    evolution={currentSliderData.largeItems[0].evolution}
                    annee={annee}
                    withChart
                  />
                  {/* Center: DONT block */}
                  <div className="flex justify-center items-center body3-medium w-[74px] h-[30px] py-[12px] bg-foundations-violet-principal text-foundations-blanc">
                    DONT :
                  </div>
                  {/* Right: Remaining FigureL */}
                  <div className="flex flex-col justify-center items-center lg:items-start lg:justify-start gap-6">
                    {currentSliderData.largeItems.slice(1).map((item, idx) => {
                      const largeItemIdx = idx + 1;
                      return (
                        <PouvoirFigureL
                          key={`large-${largeItemIdx}`}
                          valeur={item.valeur}
                          intitule={
                            currentSliderData.largeItems[largeItemIdx].title ||
                            `Item ${largeItemIdx + 1}`
                          }
                          evolution={item.evolution}
                          annee={annee}
                          withChart
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Separator */}
              {currentSliderData.smallItems.length !== 0 && (
                <div className="relative w-full flex items-center py-[26px] px-[0px] lg:px-[127px]">
                  <div className="w-full h-0 border border-dashed border-foundations-violet-principal"></div>
                  {currentSliderData.largeItems.length === 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 px-4">
                      <div className="flex justify-center items-center body3-medium w-[74px] h-[30px] py-[12px] bg-foundations-violet-principal text-foundations-blanc">
                        DONT :
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Small figures - adaptive grid columns based on count */}
              {currentSliderData.smallItems.length > 0 && (
                <div className="flex flex-col w-full">
                  {(() => {
                    const colCount = Math.min(
                      currentSliderData.smallItems.length,
                      3,
                    );
                    const rows = splitIntoRows(
                      currentSliderData.smallItems,
                      colCount,
                    );

                    return rows.map((row, rowIdx) => (
                      <div key={`row-${row.startIdx}`}>
                        <div className="flex flex-col lg:flex-row w-full">
                          {row.items.map((item, colIdx) => {
                            const itemIdx = row.startIdx + colIdx;
                            const itemTitle =
                              currentSliderData.smallItems[itemIdx].title ||
                              `Item ${itemIdx + 1}`;
                            const isRaw = isRawValue(itemTitle);
                            return (
                              <div
                                key={`small-${itemIdx}-${itemTitle}`}
                                className="flex-1 flex flex-col lg:flex-row justify-center items-start"
                              >
                                <div className="flex-1 flex justify-center">
                                  <PouvoirFigureS
                                    valeur={item.valeur}
                                    intitule={itemTitle}
                                    evolution={item.evolution}
                                    annee={annee}
                                    hidePercentage={isRaw}
                                    textFemmes={getFemmesText(
                                      item.valeur,
                                      isRaw,
                                    )}
                                  />
                                </div>
                                {colIdx < row.items.length - 1 && (
                                  <div className="flex w-full lg:w-0 lg:h-full px-5 lg:px-0">
                                    <div className="flex w-full lg:w-0 lg:h-full my-[26px] lg:my-0 border border-dashed border-foundations-violet-principal"></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {rowIdx < rows.length - 1 && (
                          <div className="relative w-full flex items-center py-[26px] px-[0px] lg:px-[127px]">
                            <div className="w-full h-0 border border-dashed border-foundations-violet-principal"></div>
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>
          {/* Next button and label */}
          <div className="hidden flex-1 lg:flex flex-col items-start justify-start text-left gap-[2px]">
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-purple-oxfam-100 transition-colors  cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="w-6 h-6 stroke-foundations-violet-principal" />
            </button>
            <p className="label-medium text-foundations-noir">
              {sliderDatas[nextIndex].title}
            </p>
          </div>
        </div>
        {/* Indicator dots */}
        <div className="flex gap-x-[15px] justify-center">
          {sliderDatas.map((item, idx) => (
            <button
              key={`indicator-${item.title}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-[15px] h-[15px] rounded-full transition-colors ${
                idx === currentIndex
                  ? "bg-foundations-violet-principal"
                  : "bg-foundations-violet-clair"
              }`}
              aria-label={`Go to slide: ${item.title}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons/chevron";
import { SectionTitle } from "./titles";

export type PionniereItem = {
  id: string;
  name: string;
  role: string;
  description: string[];
  imageSrc: string;
  imageAlt: string;
};

type PionnieresCarouselProps = {
  items: PionniereItem[];
};

function getRelativeOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;

  if (offset > total / 2) {
    offset -= total;
  }

  if (offset < -total / 2) {
    offset += total;
  }

  return offset;
}

function getItemClasses(relativeOffset: number) {
  switch (relativeOffset) {
    case 0:
      return "size-56 md:size-76 lg:size-92 z-30 shadow-[0_22px_50px_rgba(81,56,147,0.2)]";
    case -1:
    case 1:
      return "hidden lg:block size-42 lg:size-48 z-20 -mx-6";
    case -2:
    case 2:
      return "hidden lg:block size-28 lg:size-32 z-10 opacity-90 -mx-3";
    default:
      return "hidden";
  }
}

function getDirection(
  fromIndex: number,
  toIndex: number,
  total: number,
): "left" | "right" {
  const forwardSteps = (toIndex - fromIndex + total) % total;
  const backwardSteps = (fromIndex - toIndex + total) % total;

  return forwardSteps <= backwardSteps ? "right" : "left";
}

function PortraitPlaceholder({ item }: { item: PionniereItem }) {
  if (item.imageSrc) {
    return (
      <Image
        src={item.imageSrc}
        alt={item.imageAlt ?? item.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 224px, 368px"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(233,236,247,0.95)_58%,rgba(203,184,217,0.72)_100%)]" />
  );
}

export function PionnieresCarousel({ items }: PionnieresCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  const moveTo = (nextIndex: number, nextDirection: "left" | "right") => {
    if (isAnimating || nextIndex === activeIndex) {
      return;
    }

    setDirection(nextDirection);
    setIsAnimating(true);
    setActiveIndex(nextIndex);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 520);
  };

  const handlePrevious = () => {
    moveTo((activeIndex - 1 + items.length) % items.length, "left");
  };

  const handleNext = () => {
    moveTo((activeIndex + 1) % items.length, "right");
  };

  const activeItem = items[activeIndex];
  const visibleItems = items
    .map((item, index) => ({
      item,
      index,
      relativeOffset: getRelativeOffset(index, activeIndex, items.length),
    }))
    .filter(({ relativeOffset }) => Math.abs(relativeOffset) <= 2)
    .sort((a, b) => a.relativeOffset - b.relativeOffset);

  return (
    <section className="relative overflow-x-clip px-4 py-12 md:px-8 lg:px-12">
      <div className="relative mx-auto flex max-w-6xl flex-col items-center">
        <div className="flex h-84 w-full items-center justify-center md:h-100 lg:h-112">
          {visibleItems.map(({ item, index, relativeOffset }) => {
            const isActive = relativeOffset === 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (relativeOffset === 0) {
                    return;
                  }

                  moveTo(index, getDirection(activeIndex, index, items.length));
                }}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-full border-[6px] border-foundations-violet-clair bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  getItemClasses(relativeOffset),
                  isActive
                    ? "cursor-default border-foundations-bleu-site"
                    : "cursor-pointer hover:border-foundations-violet-principal",
                )}
                aria-label={
                  isActive
                    ? `${item.name}, portrait principal`
                    : `Voir ${item.name}`
                }
                aria-current={isActive}
                disabled={isAnimating && !isActive}
              >
                <PortraitPlaceholder item={item} />
              </button>
            );
          })}
        </div>

        <div className="relative z-40 -mt-2 flex w-full max-w-4xl flex-col items-center gap-6 md:-mt-8">
          <div className="flex w-full items-start justify-between gap-4 md:items-center">
            <button
              type="button"
              onClick={handlePrevious}
              className="mt-5 flex size-12 shrink-0 items-center justify-center rounded-full  bg-white text-foundations-violet-principal transition-colors hover:border-foundations-violet-principal hover:bg-foundations-violet-tres-clair cursor-pointer disabled:opacity-50 md:mt-0"
              aria-label="Pionniere precedente"
              disabled={isAnimating}
            >
              <ChevronLeftIcon className="size-5 [&_path]:stroke-current" />
            </button>

            <div
              key={`${activeItem.id}-${direction}`}
              className={cn(
                "flex-1 text-center",
                direction === "right"
                  ? "carousel-copy-enter-right"
                  : "carousel-copy-enter-left",
              )}
            >
              <SectionTitle
                id={activeItem.id}
                title={activeItem.name}
                subtitle={activeItem.role}
                classes={{
                  subtitle: "header-h3",
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="mt-5 flex size-12 shrink-0 items-center justify-center rounded-full  bg-white text-foundations-violet-principal transition-colors hover:border-foundations-violet-principal hover:bg-foundations-violet-tres-clair cursor-pointer disabled:opacity-50 md:mt-0"
              aria-label="Pionniere suivante"
              disabled={isAnimating}
            >
              <ChevronRightIcon className="size-5 [&_path]:stroke-current" />
            </button>
          </div>

          <div
            key={`description-${activeItem.id}-${direction}`}
            className={cn(
              "w-full max-w-3xl  bg-foundations-violet-tres-clair/55 px-6 py-8 text-center md:px-10",
              direction === "right"
                ? "carousel-copy-enter-right"
                : "carousel-copy-enter-left",
            )}
          >
            <div className="space-y-5 body1-regular text-foundations-gris-fonce">
              {activeItem.description.map((paragraph, i) => (
                <p key={paragraph} className={i === 0 ? "body1-medium" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  moveTo(index, getDirection(activeIndex, index, items.length))
                }
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "w-10 bg-foundations-violet-principal"
                    : "w-2.5 bg-foundations-violet-clair hover:bg-purple-oxfam-400",
                )}
                aria-label={`Aller a ${item.name}`}
                aria-current={index === activeIndex}
                disabled={isAnimating && index !== activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

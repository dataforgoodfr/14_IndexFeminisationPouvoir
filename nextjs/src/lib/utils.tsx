import { type ClassValue, clsx } from "clsx";
import type { RichTranslationValues } from "next-intl";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const richComponents: RichTranslationValues = {
  p: (chunks) => <p>{chunks}</p>,
  b: (chunks) => <span className="font-semibold">{chunks}</span>,
};

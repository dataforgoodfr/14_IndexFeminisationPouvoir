import type * as React from "react";
import { cn } from "@/lib/utils";

export type HeroProps = {
  children: React.ReactNode;
  className?: string;
};
export const Hero = ({ children, className }: HeroProps) => (
  <div
    className={cn(
      "w-full h-180 lg:h-120 flex items-center justify-center relative svg-bg svg-purple",
      className,
    )}
  >
    {children}
  </div>
);

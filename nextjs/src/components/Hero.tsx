import type * as React from "react";

export type HeroProps = {
  children: React.ReactNode;
};
export const Hero = ({ children }: HeroProps) => (
  <div className="w-full h-180 lg:h-120 flex items-center justify-center relative bg-svg-purple">
    <span className="absolute top-0 border-l-24 border-l-transparent border-r-24 border-r-transparent border-t-24 border-t-white" />
    <div className="relative">{children}</div>
  </div>
);

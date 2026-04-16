import type * as React from "react";

export type HeroProps = {
  children: React.ReactNode;
};
export const Hero = ({ children }: HeroProps) => (
  <div className="w-full h-180 lg:h-120 flex items-center justify-center relative bg-foundations-violet-principal svg-bg svg-purple">
    {children}
  </div>
);

import { cn } from "@/lib/utils";

type TooltipProps = {
  text: React.ReactNode;
  icon: React.ReactNode;
  color?: "white";
};

export const Tooltip = ({ text, icon, color }: TooltipProps) => (
  <div
    className="group flex relative items-center justify-center"
    title={typeof text === "string" ? text : undefined}
  >
    <span
      className={cn(
        "invisible group-hover:visible z-50 rounded shadow-lg px-3 py-2 absolute right-full mr-2 top-1/2 -translate-y-1/2",
        "bg-foundations-violet-principal text-white text-xs whitespace-nowrap after:content-['']",
        "after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-l-[6px] after:border-l-foundations-violet-principal after:border-t-[6px] after:border-t-transparent after:border-b-[6px] after:border-b-transparent",
        color === "white" &&
          "bg-white text-foundations-violet-principal after:border-l-white",
      )}
      aria-hidden={true}
    >
      {text}
    </span>
    {icon}
  </div>
);

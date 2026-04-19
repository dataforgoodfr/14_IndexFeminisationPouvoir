type TooltipProps = {
  text: string;
  icon: React.ReactNode;
};
export const Tooltip = ({ text, icon }: TooltipProps) => (
  <div className="group flex relative items-center justify-center" title={text}>
    <span
      className="invisible group-hover:visible z-50 rounded shadow-lg px-3 py-2 absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-foundations-violet-principal text-white text-xs whitespace-nowrap after:content-[''] after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-l-[6px] after:border-l-foundations-violet-principal after:border-t-[6px] after:border-t-transparent after:border-b-[6px] after:border-b-transparent"
      aria-hidden={true}
    >
      {text}
    </span>
    {icon}
  </div>
);

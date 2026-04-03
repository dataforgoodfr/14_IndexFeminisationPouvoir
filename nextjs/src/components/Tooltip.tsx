type TooltipProps = {
  text: string;
};
export const Tooltip = ({ text }: TooltipProps) => (
  <div
    className="group absolute bottom-5 right-5 rounded-4xl w-8 h-8 flex items-center justify-center bg-gray-200"
    aria-description={text}
  >
    <span
      className="tooltip invisible group-hover:visible z-50 rounded shadow-lg px-3 py-2 absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-[#CBB8D9] text-white text-xs whitespace-nowrap"
      aria-hidden={true}
    >
      {text}
      <svg
        width="5"
        height="38"
        className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 fill-foundations-violet-clair"
        aria-hidden={true}
      >
        <path d="M4.29289 18.2929C4.68342 18.6834 4.68342 19.3166 4.29289 19.7071L2.16577e-06 24L1.22392e-06 14L4.29289 18.2929Z" />
      </svg>
    </span>
    ?
  </div>
);

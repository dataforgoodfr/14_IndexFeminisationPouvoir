import { cn } from "@/lib/utils";

export const TrendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="44"
    height="58"
    viewBox="0 0 44 37"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
    className={cn("fill-foundations-violet-principal", props.className)}
  >
    <path d="M2 6L2.5 7L3.2832 8.31348L4.75391 31.7402L38.3838 32.4756H43.5127V36.5L0.360352 35.4014L0 3.91992H1L2 6ZM40.4092 20.7568L34.0508 14.8564L17.5 26.5L16.3125 24.125L13.5 21L8 27.5L11.5 15.5L16.8467 20.2842L25.0635 6.77246L20.2354 0.655273L41.5098 0L40.4092 20.7568Z" />
  </svg>
);

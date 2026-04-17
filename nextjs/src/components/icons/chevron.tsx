import { cn } from "@/lib/utils";

export const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 26"
    fill="none"
    {...props}
    className={cn("size-6", props.className)}
  >
    <title>Chevron gauche</title>
    <path
      d="M0.75 24.75L12.75 12.75L0.750001 0.75"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 26"
    fill="none"
    {...props}
    className={cn("size-6", props.className)}
  >
    <title>Chevron droite</title>
    <path
      d="M12.75 0.75L0.75 12.75L12.75 24.75"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

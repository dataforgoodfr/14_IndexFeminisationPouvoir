import { cn } from "@/lib/utils";

export const HommeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 23 57"
    width="23"
    height="57"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Homme"
    {...props}
    className={cn("fill-foundations-violet-clair", props.className)}
  >
    <path d="M11.1479 16.5067C15.7255 16.5067 19.7733 13.754 19.7733 9.20794C19.7733 4.64582 15.7255 0 11.1479 0C6.56926 0 4.2536 2.08951 3.39626 6.57114C2.33913 12.0895 6.56926 16.5067 11.1479 16.5067Z" />
    <path d="M14.1454 17.7103H9.15462C4.4564 17.7103 0.646559 21.1231 0.646559 25.3246L0 39.0883L4.61611 39.539L5.82485 55.5885L16.6816 56.6349L18.0128 40.8268L21.7108 41.181L22.6541 25.3246C22.6541 21.1231 19.3289 17.6299 14.1454 17.7103Z" />
  </svg>
);

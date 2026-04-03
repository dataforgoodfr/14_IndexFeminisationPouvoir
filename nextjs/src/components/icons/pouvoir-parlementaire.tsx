import { cn } from "@/lib/utils";

type IconProps = React.SVGProps<SVGSVGElement> & {
  variant?: "light" | "dark";
};
export const PouvoirParlementaireIcon = ({ variant, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="76"
    height="70"
    viewBox="0 0 76 70"
    {...props}
    className={cn(
      variant === "dark" ? "fill-white" : "fill-foundations-violet-principal",
      props.className,
    )}
  >
    <title>Pouvoir parlementaire</title>
    <g clipPath="url(#clip0_6945_9557)">
      <path d="M38.3735 14.8732L69.7818 27.4232H17.8755L34.6167 20.891L34.0454 19.4411L13.4535 27.4778L13.7353 28.9822H73.8282L74.1256 27.4778L38.3657 13.1973L0.273438 28.5379L0.860435 29.9878L38.3735 14.8732Z" />
      <path d="M75.5358 32.9268H0.572266V34.4858H75.5358V32.9268Z" />
      <path d="M74.6809 68.2461H5.87695V69.8051H74.6809V68.2461Z" />
      <path d="M66.9725 38.0785H70.5023V57.3869H72.0677V36.5195H65.4072V61.9002H54.8647V38.0785H58.3945V57.3869H59.9599V36.5195H53.2994V61.9002H42.5534V38.289H46.0832V57.6051H47.6486V36.73H40.9881V61.9002H30.023V38.289H33.5528V57.6051H35.1181V36.73H28.4577V61.9002H17.7039V38.4995H21.2337V57.8156H22.799V36.9405H16.1385V61.9002H5.60387V38.4995H9.13369V57.8156H10.699V36.9405H4.03855V61.9002H0V69.2353H1.56533V63.4592H75.1044V61.9002H66.9725V38.0785Z" />
      <path d="M39.3681 7.76387H48.4313V0H37.8027V13.0489H39.3681V7.76387ZM39.3681 1.55901H46.866V6.20486H39.3681V1.55901Z" />
    </g>
    <defs>
      <clipPath id="clip0_6945_9557">
        <rect width="75.5349" height="69.8046" />
      </clipPath>
    </defs>
  </svg>
);

import { cn } from "@/lib/utils";

export const ThumbDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="white"
    {...props}
    className={cn("size-6", props.className)}
  >
    <title>Pouce baissé</title>
    <g clipPath="url(#clip0_6909_19740)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.231395 7.86419C0.682364 8.40632 0.321012 8.58234 0.952654 10.1172C1.58287 11.645 3.29854 11.5535 6.9063 11.0184C6.00436 14.2571 5.3144 16.8128 6.30738 16.9959C7.29895 17.1719 10.5141 11.645 10.965 11.0184C11.4174 10.3847 12.5897 10.1172 13.2213 8.7654C13.2213 8.7654 13.6723 2.37251 13.3109 2.01344C12.9496 1.65437 12.1387 1.65435 10.8754 0.661623C9.61212 -0.324064 3.65847 0.0350141 2.21594 0.21103C0.771981 0.394088 1.22295 1.47131 1.04228 1.92191C0.863029 2.37251 0.41063 2.46403 0.591303 2.91463C0.771976 3.36523 0.952646 4.53397 0.500254 5.43518C0.0521293 6.33638 -0.219574 7.32206 0.231395 7.86419Z"
        fill={props.fill || "white"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 1.84965L14.5444 1.93554L14.3623 9.87597L19 10.2393L19 1.84965Z"
        fill={props.fill || "white"}
      />
    </g>
  </svg>
);

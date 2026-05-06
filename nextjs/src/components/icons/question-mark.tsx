import { cn } from "@/lib/utils";

type QuestionMarkIconProps = React.SVGProps<SVGSVGElement> & {
  questionMarkColor?: string;
};

export const QuestionMarkIcon = ({
  questionMarkColor = "var(--color-foundations-blanc)",
  ...props
}: QuestionMarkIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 51"
    width="52"
    height="51"
    fill="black"
    {...props}
    className={cn("size-6", props.className)}
    aria-hidden="true"
  >
    <rect
      x="2"
      y="2"
      width="48"
      height="47"
      rx="23.5"
      fill={props.fill || "var(--color-foundations-violet-principal)"}
    />
    <rect
      x="2"
      y="2"
      width="48"
      height="47"
      rx="23.5"
      stroke={props.fill || "var(--color-foundations-violet-principal)"}
      strokeWidth="4"
      fill={props.fill || "var(--color-foundations-violet-principal)"}
    />
    <path
      fill={questionMarkColor}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.5625 39.3501L22.2971 39.5L22.4856 33.3704L29.5625 33.105V39.3501ZM29.1514 32.0083L23.0783 28.8286L26.7684 23.0781L27.0665 22.549C27.1898 22.3721 27.3012 22.1314 27.4023 21.8292C27.4999 21.5257 27.5496 21.2614 27.5496 21.0347C27.5496 20.4045 27.3149 19.8616 26.8421 19.407C26.3692 18.9538 25.8245 18.7272 25.2026 18.7272C24.5328 18.7531 23.9657 18.9742 23.5083 19.3888C23.0475 19.8055 22.7683 20.493 22.6706 21.4512L16.0014 21.4125C15.9774 19.6726 16.2618 18.1725 16.8597 16.9106C17.4524 15.65 18.237 14.6215 19.2067 13.827C20.1746 13.0315 21.2933 12.4454 22.5575 12.0676C23.8253 11.6897 25.1153 11.5 26.4344 11.5C27.2515 11.5 28.0293 11.6068 28.7608 11.8226C29.4923 12.0354 30.181 12.332 30.8285 12.7098L33.8454 15.7385C34.6163 17.0239 35 18.4379 35 19.975C35 20.9332 34.8527 21.9242 34.5529 22.9462C34.2565 23.9684 33.8334 24.8825 33.2886 25.6889L29.1514 32.0083Z"
    />
  </svg>
);

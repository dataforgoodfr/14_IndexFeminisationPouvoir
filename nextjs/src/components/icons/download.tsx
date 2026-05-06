import { cn } from "@/lib/utils";

type DownloadIconProps = React.SVGProps<SVGSVGElement> & {
  downloadColor?: string;
};

export const DownloadIcon = ({
  downloadColor = "var(--color-foundations-blanc)",
  ...props
}: DownloadIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 51"
    width="52"
    height="51"
    fill="black"
    {...props}
    className={cn("size-6", props.className)}
  >
    <title>Télécharger</title>

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
      fill={downloadColor}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M35.9392 29.3923C35.8546 28.9946 31.9558 26.5537 31.9558 26.5537L30.5352 26.9434L33.8129 29.9769L29.4694 29.782L29.1155 31.7397L22.5529 31.9346L22.2847 29.8754L18.9151 29.4857L21.6636 26.7486L20.1583 26.5537C20.1583 26.5537 17.0581 28.6049 16.3442 29.3923C15.6375 30.1717 16.1677 32.2309 16.6124 33.7989C17.0581 35.3589 18.1176 35.4603 19.4527 35.4603C20.7805 35.4603 31.7794 35.2654 33.7283 35.4603C35.6782 35.6552 35.6781 35.164 35.8546 33.3077C36.031 31.4434 36.031 29.782 35.9392 29.3923Z"
    />
    <path
      fill={downloadColor}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M31.1061 21.7914L28.8776 21.4939L28.5237 15.5L23.7129 16.2897L23.5355 21.6888L20.9531 22.1822L25.8485 27.7773L31.1061 21.7914Z"
    />
  </svg>
);

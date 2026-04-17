export const ArrowDownIcon = (_props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="25"
    height="25"
    viewBox="-2.5 -2.5 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Fleche vers le bas"
  >
    <circle cx="10" cy="10" r="10" fill="#FF003D" />
    <g clipPath="url(#arrow-down-clip)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 10.2111L9.69405 16L5.2 10.4142L8.19507 10.4142C8.19507 10.4142 8.6635 5.86542 8.2866 4C8.2866 4 10.7246 4 11.7508 4.31064L11.9396 9.90047L14 10.2111Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="arrow-down-clip">
        <rect
          width="8.8"
          height="12"
          fill="white"
          transform="translate(14 16) rotate(180)"
        />
      </clipPath>
    </defs>
  </svg>
);

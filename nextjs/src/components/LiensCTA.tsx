import Link from "next/link";
import sourceURLs from "@/data/source_urls.json";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "./icons/download";
import { QuestionMarkIcon } from "./icons/question-mark";
import { Tooltip } from "./Tooltip";

type LiensCTAProps = {
  variant?: "default" | "horizontal";
  className?: string;
  downloadURL?: string;
  color?: "white";
};

export { sourceURLs };

export const LiensCTA = ({
  variant = "default",
  className,
  downloadURL = sourceURLs.default.default_source_url,
  color,
}: LiensCTAProps) => (
  <div
    className={cn(
      "flex flex-row gap-4 shrink-0",
      variant === "default" && "lg:flex-col",
      className,
    )}
  >
    <Link href="/methodologie">
      <Tooltip
        text="Méthodologie de calcul"
        color={color}
        icon={
          <QuestionMarkIcon
            className={cn("w-12.5 h-12.5")}
            fill={
              color === "white" ? "var(--color-foundations-blanc)" : undefined
            }
            questionMarkColor={
              color === "white"
                ? "var(--color-foundations-violet-principal)"
                : undefined
            }
          />
        }
      />
    </Link>
    <a
      href={downloadURL ?? sourceURLs.default.default_source_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Source des données ayant permis d'obtenir ce score"
    >
      <Tooltip
        text="Télécharger les données"
        color={color}
        icon={
          <DownloadIcon
            className={cn("w-12.5 h-12.5")}
            fill={
              color === "white" ? "var(--color-foundations-blanc)" : undefined
            }
            downloadColor={
              color === "white"
                ? "var(--color-foundations-violet-principal)"
                : undefined
            }
          />
        }
      />
    </a>
  </div>
);

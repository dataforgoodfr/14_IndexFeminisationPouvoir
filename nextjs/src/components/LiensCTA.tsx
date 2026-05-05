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
};

export { sourceURLs };

export const LiensCTA = ({
  variant = "default",
  className,
  downloadURL = sourceURLs.default.default_source_url,
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
        icon={<QuestionMarkIcon className="w-12.5 h-12.5" />}
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
        icon={<DownloadIcon className="w-12.5 h-12.5" />}
      />
    </a>
  </div>
);

import Link from "next/link";
import { DownloadIcon } from "./icons/download";
import { QuestionMarkIcon } from "./icons/question-mark";
import { Tooltip } from "./Tooltip";
import { cn } from "@/lib/utils";

type LiensCTAProps = {
  variant?: "default" | "horizontal";
};

export const LiensCTA = ({ variant = "default" }: LiensCTAProps) => (
  <div
    className={cn(
      "flex flex-row gap-4 shrink-0",
      variant === "default" && "lg:flex-col",
    )}
  >
    <Link href="/methodologie">
      <Tooltip
        text="Méthode de calcul"
        icon={<QuestionMarkIcon className="w-12.5 h-12.5" />}
      />
    </Link>
    <Link href="/telecharger">
      <Tooltip
        text="Télécharger les données"
        icon={<DownloadIcon className="w-12.5 h-12.5" />}
      />
    </Link>
  </div>
);

import Link from "next/link";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "./icons/download";
import { QuestionMarkIcon } from "./icons/question-mark";
import { Tooltip } from "./Tooltip";

type LiensCTAProps = {
  variant?: "default" | "horizontal";
  className?: string;
};

export const LiensCTA = ({ variant = "default", className }: LiensCTAProps) => (
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
    <Link href="/telecharger">
      <Tooltip
        text="Télécharger les données"
        icon={<DownloadIcon className="w-12.5 h-12.5" />}
      />
    </Link>
  </div>
);

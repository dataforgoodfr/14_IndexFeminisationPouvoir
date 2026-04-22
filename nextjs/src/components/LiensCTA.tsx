import Link from "next/link";
import { DownloadIcon } from "./icons/download";
import { QuestionMarkIcon } from "./icons/question-mark";
import { Tooltip } from "./Tooltip";

export const LiensCTA = () => (
  <div className="flex flex-row lg:flex-col gap-4 shrink-0">
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

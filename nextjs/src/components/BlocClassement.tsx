import Link from "next/link";
import { DownloadIcon } from "@/components/icons/download";
import { QuestionMarkIcon } from "@/components/icons/question-mark";
import { Standings } from "@/components/Standings";
import { ShortDate } from "./ShortDate";
import { Tooltip } from "./Tooltip";

type BlockClassementProps = {
  data: { label: string; percentage: number; evolution?: number }[];
  title: string;
  description: string;
  derniereMiseAJour?: Date;
};

export const BlocClassement = ({
  data,
  title,
  description,
  derniereMiseAJour,
}: BlockClassementProps) => {
  return (
    <div className="flex flex-col w-full md:flex-row gap-x-11.5 gap-y-10 px-5 md:px-53.75 py-16.25 items-center lg:items-start justify-center bg-foundations-violet-tres-clair">
      <div className="flex-1 flex flex-col gap-y-8.5 text-left items-start md:items-end justify-end">
        <div className="max-w-70">
          <h3 className="header-h3 text-foundations-violet-principal">
            {title}
          </h3>
          <div className="divider-dashed-horizontal w-2/3 my-3" />
          <p className="body2-regular text-foundations-noir mt-6">
            {description}
          </p>
          {derniereMiseAJour && (
            <p className="label-regular text-foundations-violet-principal mt-3">
              Dernière mise à jour : <ShortDate date={derniereMiseAJour} />
            </p>
          )}
        </div>
      </div>
      <div className="flex-2">
        <Standings
          data={data.map(({ label, percentage, evolution }) => ({
            label,
            percentage,
            evolution,
          }))}
        />
      </div>
      <div className="flex flex-row lg:flex-col lg:justify-between gap-4">
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
    </div>
  );
};

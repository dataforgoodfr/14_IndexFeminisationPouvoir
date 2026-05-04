import { Standings } from "@/components/Standings";
import { LiensCTA } from "./LiensCTA";
import { ShortDate } from "./ShortDate";

type BlockClassementProps = {
  data: { label: string; percentage: number; evolution?: number }[];
  title: string;
  description: string;
  derniereMiseAJour?: Date;
  thumbsUpTopValue?: number;
  thumbsDownBottomValue?: number;
  downloadURL?: string;
};

export const BlocClassement = ({
  data,
  title,
  description,
  derniereMiseAJour,
  thumbsUpTopValue = 5,
  thumbsDownBottomValue = 5,
  downloadURL,
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
      <div className="flex-2 w-full">
        <Standings
          thumbsUpTop={thumbsUpTopValue}
          thumbsDownBottom={thumbsDownBottomValue}
          data={data.map(({ label, percentage, evolution }) => ({
            label,
            percentage,
            evolution,
          }))}
        />
      </div>
      <LiensCTA downloadURL={downloadURL} />
    </div>
  );
};

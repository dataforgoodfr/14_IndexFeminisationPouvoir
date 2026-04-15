import { RecoIcon } from "@/components/icons/reco";

type RecommendationCardProps = {
  color: string;
  title: string;
  description: string;
};

export function RecommendationCard({
  color,
  title,
  description,
}: RecommendationCardProps) {
  return (
    <div className="flex flex-row gap-[18px] items-center justify-center p-[12px] w-[340px]">
      <RecoIcon color={color} className="shrink-0 size-[80px]" />
      <div className="flex flex-col gap-[6px] text-foundations-violet-principal w-[218px]">
        <p className="body1-medium">{title}</p>
        <p className="body2-regular">{description}</p>
      </div>
    </div>
  );
}

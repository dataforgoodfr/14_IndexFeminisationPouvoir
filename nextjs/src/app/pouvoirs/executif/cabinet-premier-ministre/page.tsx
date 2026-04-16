import GenderDistributionChart from "@/components/charts/GenderDistributionChart";
import { SectionTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { composantes } = pouvoirData.executif;

export default function Page() {
  return (
    <>
      <SectionTitle
        title="Cabinet du premier ministre"
        id="cabinet-premier-ministre"
      />
      <GenderDistributionChart
        pourcentage={composantes.cabiner_premier_ministre.score}
      />
    </>
  );
}

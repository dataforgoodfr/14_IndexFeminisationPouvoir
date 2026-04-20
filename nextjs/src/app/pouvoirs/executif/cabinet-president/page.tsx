import GenderDistributionChart from "@/components/charts/GenderDistributionChart";
import { SectionTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { composantes } = pouvoirData.executif;

export default function Page() {
  return (
    <>
      <SectionTitle
        title="Cabinet du président de la république"
        id="cabinet-presidence"
      />
      <GenderDistributionChart
        pourcentage={composantes.cabinet_presidence.score}
      />
    </>
  );
}

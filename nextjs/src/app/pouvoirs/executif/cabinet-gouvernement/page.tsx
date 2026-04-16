import GenderDistributionChart from "@/components/charts/GenderDistributionChart";
import { SectionTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { composantes } = pouvoirData.executif;

export default function Page() {
  return (
    <>
      <SectionTitle
        title="Dirigeantes de cabinet au gouvernement"
        id="cabinet-gouvernement"
      />
      <GenderDistributionChart
        pourcentage={composantes.directrices_cabinet_gouvernement.score}
      />
    </>
  );
}

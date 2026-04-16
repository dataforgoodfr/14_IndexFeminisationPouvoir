import GenderDistributionChart from "@/components/charts/GenderDistributionChart";
import { SectionTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { composantes } = pouvoirData.executif;

export default function Page() {
  return (
    <>
      <SectionTitle title="Femmes aux postes régaliens" id="postes-regaliens" />
      <GenderDistributionChart
        pourcentage={composantes.ministeres_regaliens.score}
      />
    </>
  );
}

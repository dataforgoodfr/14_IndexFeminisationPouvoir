import GenderDistributionChart from "@/components/charts/GenderDistributionChart";
import { SectionTitle } from "@/components/titles";
import pouvoirData from "@/data/pouvoir.json";

const { composantes } = pouvoirData.executif;

export default function Page() {
  return (
    <>
      <SectionTitle title="Femmes au gouvernement" id="gouvernement" />
      <GenderDistributionChart pourcentage={composantes.gouvernement.score} />
    </>
  );
}

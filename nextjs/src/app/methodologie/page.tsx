import { LoupeIcon } from "@/components/icons/loupe";
import { NormalisationIcon } from "@/components/icons/normalisation";
import { TrendIcon } from "@/components/icons/trend";
import { BlocMethodo } from "../../components/BlocMethodo";

export default function Page() {
  return (
    <div className="lg:w-260 flex flex-col gap-10 p-4">
      <BlocMethodo title="Étape 1 : Collecte de données" icon={<LoupeIcon />}>
        <p className="body1-medium text-foundations-gris-fonce">
          Nous collectons des données de sources variées afin d'assurer leur
          fiabilité.
        </p>
      </BlocMethodo>
      <BlocMethodo title="Étape 2 : Normalisation" icon={<NormalisationIcon />}>
        <p className="body1-medium text-foundations-gris-fonce">
          Les données collectées sont normalisées pour garantir leur cohérence.
        </p>
      </BlocMethodo>
      <BlocMethodo title="Étape 3 : Calcul de la tendance" icon={<TrendIcon />}>
        <p className="body1-medium text-foundations-gris-fonce">
          Les données collectées sont normalisées pour garantir leur cohérence.
        </p>
      </BlocMethodo>
    </div>
  );
}

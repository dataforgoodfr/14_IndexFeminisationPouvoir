import { LoupeIcon } from "@/components/icons/loupe";
import { NormalisationIcon } from "@/components/icons/normalisation";
import { BlocMethodo } from "../../components/BlocMethodo";

export default function Page() {
  return (
    <div className="lg:w-260 flex flex-col gap-10">
      <BlocMethodo
        order={1}
        title="Collecte de données"
        icon={<LoupeIcon />}
        description="Nous collectons des données de sources variées afin d'assurer leur fiabilité."
      />
      <BlocMethodo
        order={2}
        title="Normalisation"
        icon={<NormalisationIcon />}
        description="Les données collectées sont normalisées pour garantir leur cohérence."
      />
      <BlocMethodo
        order={3}
        title="Calcul de la tendance"
        icon={<LoupeIcon />}
        description="Les données collectées sont normalisées pour garantir leur cohérence."
      />
    </div>
  );
}

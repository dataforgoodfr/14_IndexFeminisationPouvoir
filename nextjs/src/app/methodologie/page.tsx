import { LoupeIcon } from "@/components/icons/loupe";
import { NormalisationIcon } from "@/components/icons/normalisation";

type EtapeProps = {
  title: string;
  icon: React.ReactNode;
  description: React.ReactNode;
  order: number;
};
const Etape = ({ title, icon, description, order }: EtapeProps) => (
  <div className="flex flex-row items-center gap-4 p-4 border border-gray-200">
    {icon}
    <div className="flex flex-col">
      <h3 className="header-h3">
        Étape {order} : {title}
      </h3>
      <p className="body1-medium text-foundations-gris-fonce">{description}</p>
    </div>
  </div>
);
export default function Page() {
  return (
    <div className="lg:w-260 flex flex-col gap-10">
      <Etape
        order={1}
        title="Collecte de données"
        icon={<LoupeIcon />}
        description="Nous collectons des données de sources variées afin d'assurer leur fiabilité."
      />
      <Etape
        order={2}
        title="Normalisation"
        icon={<NormalisationIcon />}
        description="Les données collectées sont normalisées pour garantir leur cohérence."
      />
      <Etape
        order={3}
        title="Calcul de la tendance"
        icon={<LoupeIcon />}
        description="Les données collectées sont normalisées pour garantir leur cohérence."
      />
    </div>
  );
}

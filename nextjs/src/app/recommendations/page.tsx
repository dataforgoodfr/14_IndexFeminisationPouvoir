import { HTMLAttributes, JSX } from "react";
import Link from "next/link";
import { AcademicIcon } from "@/components/icons/academic";
import { BriefcaseIcon } from "@/components/icons/briefcase";
import { ChartBarIcon } from "@/components/icons/graph";
import { ScaleIcon } from "@/components/icons/scale";
import { ThumbUpIcon } from "@/components/icons/thumbup";
import { UsersIcon } from "@/components/icons/users";
import { DocumentIcon } from "@/components/icons/document";

export default function Recommendations() {
  return (
    <div className="flex items-center justify-center  font-sans bg-[#F9F9F9]">
      <div className="flex flex-col gap-4 max-w-296 items-center justify-between py-12 px-4 gap-8">
        <div className="flex flex-col justify-center text-center w-full gap-2">
          <h1 className="text-2xl">Recommandations</h1>
          <p className="text-sm text-[#868686]">
            Principales pistes d'action pour promouvoir la feminisation du
            pouvoir
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-5">
          <RecommandationCard title="Cadre legislatif" icon={ScaleIcon}>
            Renforcer les quotas de parité dans les instances décisionnelles et
            sanctionner le non-respect des obligations légales.
          </RecommandationCard>
          <RecommandationCard title="Culture organisationelle" icon={UsersIcon}>
            Promouvoir une culture d'inclusion et lutter contre les biais
            inconscients dans les processus de sélection,
          </RecommandationCard>
          <RecommandationCard title="Formation et mentorat" icon={AcademicIcon}>
            Développer des programmes de leadership féminin et créer des réseaux
            de mentorat pour accompagner les carrières.
          </RecommandationCard>
          <RecommandationCard
            title="Equilibre vie pro/perso"
            icon={BriefcaseIcon}
          >
            Favoriser la flexibilité du travail et partager équitablement les
            responsabilités familiales.
          </RecommandationCard>
          <RecommandationCard
            title="Transparence des données"
            icon={ChartBarIcon}
          >
            Publier régulièrement des statistiques genrées et suivre les progrès
            réalisés dans chaque secteur.
          </RecommandationCard>
          <RecommandationCard title="Engagement des parties" icon={ThumbUpIcon}>
            Impliquer tous les acteurs institutionnels et privés dans une
            démarche collective de changement
          </RecommandationCard>
        </div>
        <Link
          href="/rapport"
          className="px-5 py-3 flex items-center justify-center gap-2 bg-black text-background font-bold text-sm"
        >
          <DocumentIcon className="w-4 h-4" />
          Lire les recommandations complètes
        </Link>
      </div>
    </div>
  );
}

type RecommandationCardProps = {
  title: string;
  icon: (props: HTMLAttributes<HTMLOrSVGElement>) => JSX.Element;
  children: React.ReactNode;
};

const RecommandationCard = ({
  title,
  icon: Icon,
  children,
}: RecommandationCardProps) => {
  return (
    <div className="flex flex-col p-6 bg-white gap-2">
      <div className="bg-black w-[45px] h-[45px] rounded-md flex justify-center items-center">
        <Icon />
      </div>
      <div>{title}</div>
      <p className="text-[#868686] text-sm leading-6">{children}</p>
    </div>
  );
};

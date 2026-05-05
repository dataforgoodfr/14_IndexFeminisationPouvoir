import { BlocMethodo } from "@/components/BlocMethodo";
import { OrdinateurIcon } from "@/components/icons/ordinateur";

export default function Page() {
  return (
    <div className="lg:w-260 flex flex-col gap-10 p-8">
      <BlocMethodo
        icon={<OrdinateurIcon />}
        title="Processus de collecte,scrapping et automatisation des données par Dataforgood."
      >
        <div className="max-w-225">
          En 2025, Oxfam France a publié la première édition de l'« Index de
          féminisation du pouvoir », visant à évaluer de manière précise la
          place réelle des femmes aux plus hauts niveaux de responsabilité. Cet
          index repose sur 26 indicateurs, répartis en quatre piliers : le
          pouvoir exécutif, le pouvoir parlementaire, le pouvoir local et les
          autres formes de pouvoir. Afin d'améliorer la qualité et l'efficacité
          de la collecte des données, Oxfam France a établi un partenariat avec
          l'organisation Data for Good. Dans ce cadre, des techniques de
          collecte automatisée de données (scraping) ont été mises en œuvre afin
          de constituer les taux de féminisation des différents niveaux de
          pouvoir et d'en faciliter la mise à jour. L'index s'appuie notamment
          sur des sources institutionnelles telles que le Répertoire national
          des élus, ainsi que sur les API de l'Annuaire du service public et du
          Sénat, largement mobilisées pour la collecte des données. Ces travaux
          ont permis de constituer une base de données robuste et structurée".
        </div>
      </BlocMethodo>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { DoughnutChart } from "@/components/charts/DoughnutChart";
import { BookIcon } from "@/components/icons/book";
import { MondeIcon } from "@/components/icons/monde";
import { AutresPouvoirsIcon } from "@/components/icons/pouvoir-autres";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";
import { RecommendationCard } from "@/components/RecommendationCard";
import { StatsCard } from "@/components/StatsCard";
import pouvoirData from "@/data/pouvoir.json";

const EVOLUTION_FILTERS = [
  "Gouvernement",
  "Postes régaliens",
  "Assemblée nationale",
  "Sénat",
  "Commission européenne",
];

const RECOMMENDATIONS = [
  {
    color: "var(--color-foundations-jaune-oxfam)",
    title: "Cadre législatif",
    description:
      "Renforcer les quotas de parité dans les instances décisionnelles et sanctionner le non-respect des obligations légales.",
  },
  {
    color: "var(--color-foundations-violet-principal)",
    title: "Formation & mentorat",
    description:
      "Développer des programmes de formation et de mentorat pour préparer les femmes à accéder aux postes de décision.",
  },
  {
    color: "var(--color-foundations-vert-principal)",
    title: "Culture organisationnelle",
    description:
      "Transformer les cultures organisationnelles pour éliminer les biais de genre et favoriser un environnement inclusif.",
  },
  {
    color: "var(--color-foundations-orange-site)",
    title: "Transparence & données",
    description:
      "Améliorer la collecte et la publication de données sexuées pour mesurer les progrès et identifier les obstacles.",
  },
  {
    color: "var(--color-foundations-bleu-site)",
    title: "Engagements volontaires",
    description:
      "Encourager les organisations à prendre des engagements volontaires en faveur de la parité et à en rendre compte.",
  },
];

export default function Home() {
  const scores = [
    pouvoirData.executif.score,
    pouvoirData.parlementaire.score,
    pouvoirData.local.score,
    pouvoirData.autre.score,
  ];
  const overallTaux = Math.round(
    scores.reduce((a, b) => a + b, 0) / scores.length,
  );

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-foundations-violet-clair flex flex-col items-center gap-8 px-0 lg:px-[229px] pb-[139px] pt-9">
        <h1 className="header-h1 text-foundations-violet-principal text-center max-w-[964px]">
          Le pouvoir, nom masculin&nbsp;: l'index de féminisation du pouvoir
        </h1>
        <p className="header-h4 text-foundations-gris-fonce text-center max-w-[558px]">
          Une analyse complète de la représentation des femmes dans les
          instances de pouvoir en France, en Europe et dans le monde
        </p>
        <Image
          src="/images/homepage-hero-image.png"
          alt="Collage de photos illustrant la féminisation du pouvoir"
          width={1023}
          height={1116}
          className="w-full max-w-[1023px]"
          priority
        />
        <div className="flex gap-8 items-center flex-wrap justify-center">
          <Link
            href="/pouvoirs"
            className="button button-primary font-headline"
          >
            Les pouvoirs
          </Link>
          <Link
            href="/recommandations"
            className="button font-headline flex gap-3 items-center"
          >
            <BookIcon />
            Lire le rapport
          </Link>
        </div>
      </section>

      {/* 2. Présentation de l'Index */}
      <section className="bg-white flex gap-[114px] items-center justify-center px-[150px] py-[120px]">
        {/* Left column */}
        <div className="flex flex-col gap-[60px] flex-1 min-w-0">
          <div className="flex flex-col gap-[34px]">
            <h2 className="header-h1 text-foundations-violet-principal">
              Présentation de l'Index
            </h2>
            <p className="header-h4 text-foundations-violet-principal max-w-[605px]">
              L'Index de Féminisation au Pouvoir mesure la représentation des
              femmes dans les différentes instances décisionnelles depuis 2010.
              Cet indicateur composite analyse la présence féminine dans les
              organes exécutifs, législatifs et locaux pour évaluer l'évolution
              de la parité dans les sphères de pouvoir.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-[40px] gap-y-4">
            <StatsCard
              label="Pouvoir exécutif"
              score={pouvoirData.executif.score}
              evolution={pouvoirData.executif.evolution}
            />
            <StatsCard
              label="Pouvoir parlementaire"
              score={pouvoirData.parlementaire.score}
              evolution={pouvoirData.parlementaire.evolution}
            />
            <StatsCard
              label="Pouvoir local"
              score={pouvoirData.local.score}
              evolution={pouvoirData.local.evolution}
            />
            <StatsCard
              label="Autres pouvoirs"
              score={pouvoirData.autre.score}
              evolution={pouvoirData.autre.evolution}
            />
          </div>
        </div>
        {/* Right column */}
        <div className="flex flex-col items-center gap-[13px] w-[443px] shrink-0">
          <DoughnutChart value={overallTaux} variant="light" className="size-[272px]" />
          <div className="border border-foundations-violet-tres-clair flex flex-col gap-[10px] p-4 w-[344px]">
            <div className="flex items-center gap-2">
              <span className="header-h1 text-foundations-violet-principal leading-none">
                {overallTaux}%
              </span>
            </div>
            <p className="header-h2 text-foundations-violet-principal">
              Taux de féminisation du pouvoir en France
            </p>
            <p className="label-medium text-foundations-violet-principal">
              Dernière mise à jour : {pouvoirData.dateMiseAJour}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Explorer les données */}
      <section className="bg-foundations-violet-principal flex flex-col items-center gap-[44px] px-[170px] py-[60px] relative overflow-hidden">
        <div className="flex flex-col items-center gap-4 text-center max-w-[748px]">
          <h2 className="header-h1 text-white">Explorer les données</h2>
          <p className="header-h2 text-white">
            Sélectionnez une catégorie pour visualiser les données détaillées
          </p>
        </div>
        {/* Row 1: 3 cards */}
        <div className="flex gap-[65px] flex-wrap justify-center">
          <CategoryCard
            icon={PouvoirParlementaireIcon}
            title="Pouvoir parlementaire"
            description="La parité au sein du Parlement a progressé plus lentement que celle du gouvernement"
            href="/pouvoirs/parlementaire"
          />
          <CategoryCard
            icon={PouvoirExecutifIcon}
            title="Pouvoir exécutif"
            description="La représentation des femmes dans les instances exécutives de l'État"
            href="/pouvoirs/executif"
          />
          <CategoryCard
            icon={PouvoirLocalIcon}
            title="Pouvoir local"
            description="La parité dans les collectivités territoriales et les instances locales"
            href="/pouvoirs/local"
          />
        </div>
        {/* Row 2: 2 cards */}
        <div className="flex gap-[65px] flex-wrap justify-center">
          <CategoryCard
            icon={AutresPouvoirsIcon}
            title="Autres pouvoirs"
            description="La représentation des femmes dans les autres sphères de pouvoir"
            href="/pouvoirs/autres"
          />
          <CategoryCard
            icon={MondeIcon}
            title="Dans le monde"
            description="La féminisation du pouvoir à l'échelle européenne et mondiale"
            href="/pouvoirs/monde"
          />
        </div>
      </section>

      {/* 4. Évolution des indicateurs */}
      <section className="bg-foundations-violet-clair flex flex-col items-center gap-[43px] px-[14px] py-[12px]">
        <h2 className="header-h1 text-white">Évolution des indicateurs</h2>
        <p className="header-h4 text-foundations-violet-principal">
          Sélectionnez une catégorie pour visualiser les données détaillées
        </p>
        {/* Filter tabs */}
        <div className="flex gap-4 flex-wrap justify-center">
          {EVOLUTION_FILTERS.map((filter, i) => (
            <button
              key={filter}
              type="button"
              className={`body1-medium px-4 py-2 rounded-[3.75px] border ${
                i === 0
                  ? "bg-foundations-violet-principal text-white border-foundations-violet-principal"
                  : "bg-white text-foundations-violet-principal border-foundations-violet-principal"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        {/* Chart placeholder */}
        <div className="bg-foundations-violet-tres-clair rounded-[14px] h-[359px] w-full max-w-[813px] flex items-center justify-center">
          <p className="body1-medium text-foundations-violet-principal">
            Graphique à venir
          </p>
        </div>
      </section>

      {/* 5. Quote block */}
      <section className="bg-foundations-violet-principal px-[52px] py-[60px]">
        <p className="body4-medium text-white text-center max-w-[1377px] mx-auto">
          En 80 ans, le pouvoir s'est lentement féminisé, néanmoins le compte
          n'y est pas, les plus hautes sphères du pouvoir français restent
          encore très (trop) masculines. La parité et la participation égale des
          femmes à la vie publique restent un combat essentiel pour faire
          avancer les droits des femmes.
        </p>
      </section>

      {/* 6. Recommandations */}
      <section className="bg-white flex flex-col items-center gap-[38px] px-[88px] py-[60px]">
        <div className="flex flex-col items-center gap-[10px] text-center">
          <h2 className="header-h1 text-foundations-violet-principal">
            Recommandations
          </h2>
          <p className="body2-regular text-[#8d8d8d]">
            Principales pistes d'action pour promouvoir la féminisation du
            pouvoir
          </p>
        </div>
        {/* Row 1: 3 cards */}
        <div className="flex gap-[26px] flex-wrap justify-center">
          {RECOMMENDATIONS.slice(0, 3).map((reco) => (
            <RecommendationCard key={reco.title} {...reco} />
          ))}
        </div>
        {/* Row 2: 2 cards */}
        <div className="flex gap-[26px] flex-wrap justify-center">
          {RECOMMENDATIONS.slice(3).map((reco) => (
            <RecommendationCard key={reco.title} {...reco} />
          ))}
        </div>
        <Link
          href="/recommandations"
          className="button button-primary font-headline"
          style={{ width: "392px", justifyContent: "center" }}
        >
          Lire les recommandations
        </Link>
      </section>
    </>
  );
}

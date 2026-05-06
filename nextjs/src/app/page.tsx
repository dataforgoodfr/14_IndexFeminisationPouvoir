import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CategoryCard } from "@/components/CategoryCard";
import { DoughnutChart } from "@/components/charts/DoughnutChart";
import { EvolutionBadge } from "@/components/EvolutionBadge";
import { EvolutionSection } from "@/components/EvolutionSection";
import { BookIcon } from "@/components/icons/book";
import { FemmeMondeIcon } from "@/components/icons/femme-monde";
import { InequalIcon } from "@/components/icons/inequal";
import { LogoDataForGood } from "@/components/icons/logo-d4g";
import { LogoOxfamHorizontal } from "@/components/icons/logo-oxfam-horizontal";
import { MondeIcon } from "@/components/icons/monde";
import { AutresPouvoirsIcon } from "@/components/icons/pouvoir-autres";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";
import { LiensCTA } from "@/components/LiensCTA";
import { RecommendationCard } from "@/components/RecommendationCard";
import { StatsCard } from "@/components/StatsCard";
import pouvoirData from "@/data/pouvoir.json";
import { richComponents } from "@/lib/utils";

const { dateMiseAJour, score, evolution } = pouvoirData;

export default async function Home() {
  const t = await getTranslations("HomePage");
  return (
    <>
      {/* 1. Hero */}
      <section className="flex-1 bg-foundations-violet-clair flex flex-col items-center justify-between gap-8 px-4 pt-9">
        <div className="flex-1 flex flex-col lg:flex-row gap-8 items-center lg:items-start  ">
          <div className="flex-1  flex flex-col items-center gap-4 max-w-140">
            <h1 className="header-h1 text-foundations-violet-principal text-center lg:text-left ">
              Le pouvoir, nom masculin.
              <br />
              l'index de féminisation du pouvoir
            </h1>
            <p className="header-h4 text-foundations-violet-principal text-center lg:text-left  ">
              Une analyse complète de la représentation des femmes dans les
              instances de pouvoir en France, en Europe et dans le monde
            </p>

            <div className="w-full flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-4">
              <LogoOxfamHorizontal className="fill-foundations-vert-site w-47" />
              <LogoDataForGood className="w-70" />
            </div>

            <p className="w-full header-h3 text-center lg:text-left text-foundations-violet-tres-clair">
              Un Index réalisé par Oxfam France et Data for good.
            </p>
          </div>
          <div className="flex-1 ">
            <Image
              src={`/images/oxfam-homepage.webp`}
              alt="Collage de photos illustrant la féminisation du pouvoir"
              width={696}
              height={636}
              className="w-full max-w-174"
              priority
            />
          </div>
        </div>
        <div className="flex gap-8 mt-10 mb-15 items-center flex-wrap justify-center">
          <a
            href="#explorer-les-donnees"
            className="button button-primary font-headline"
          >
            Les pouvoirs
          </a>
          <div className="visible lg:hidden">
            <Link
              href="https://www.oxfamfrance.org/app/uploads/2026/05/Oxfam_IndexFemmesAuPouvoirEnFrance2026_sous-embargo-6-mai26.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="button font-headline flex gap-3 items-center"
            >
              <BookIcon />
              Lire le rapport
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Présentation de l'Index */}
      <section className="bg-white flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center lg:justify-center px-4 py-16 lg:px-32 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-4 lg:gap-15 flex-1 min-w-0 max-w-180">
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="header-h1 text-foundations-violet-principal">
              Présentation de l'Index
            </h2>
            <div className="header-h4 text-foundations-violet-principal max-w-150 my-4 flex flex-col gap-4">
              <p>
                L'Index de Féminisation au Pouvoir mesure la représentation des
                femmes dans les différentes instances décisionnelles depuis
                2010.
              </p>
              <p>
                Cet indicateur composite analyse la présence féminine dans les
                organes exécutifs, législatifs et locaux pour évaluer
                l'évolution de la parité dans les sphères de pouvoir.
              </p>
            </div>
          </div>
          <div className="hidden lg:flex flex-row flex-wrap justify-between gap-4 px-8 lg:px-16">
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
        <div className="flex flex-col items-center gap-3.25 md:w-110 shrink-0">
          <DoughnutChart
            value={score}
            variant="light"
            className="size-68 w-68"
            icon={InequalIcon}
            iconProps={{
              width: 75,
              height: 120,
            }}
          />
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="border border-foundations-violet-tres-clair flex flex-col gap-2.5 p-4 w-86">
              <div className="flex items-center gap-2">
                <span className="header-h1 text-[50px]! text-foundations-violet-principal leading-none">
                  {score}%
                </span>
                <EvolutionBadge value={evolution} />
              </div>
              <p className="header-h2 text-foundations-violet-principal">
                Taux de féminisation du pouvoir en France
              </p>
              <p className="label-medium text-foundations-violet-principal">
                Dernière mise à jour : {dateMiseAJour}
              </p>
            </div>
            <LiensCTA className="self-center lg:self-end mb-12 shrink-0" />
          </div>
          <div className="grid grid-cols-2 lg:hidden gap-y-14 gap-x-1.25">
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
      </section>

      {/* 3. Explorer les données */}
      <section
        id="explorer-les-donnees"
        className="svg-bg svg-trees-violet flex flex-col items-center gap-11 px-8 py-15 w-full"
      >
        <div className="flex flex-col items-center gap-4 text-center ">
          <h2 className="header-h1 text-white">Explorer les données</h2>
          <p className="body1-regular text-white">
            Sélectionnez une catégorie pour visualiser les données détaillées
          </p>
        </div>
        <div className="flex flex-row justify-center flex-wrap gap-16 h-full max-w-6xl">
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
            title={
              <>
                Pouvoir
                <br />
                local
              </>
            }
            description="La parité dans les collectivités territoriales et les instances locales"
            href="/pouvoirs/local"
          />
          <CategoryCard
            icon={AutresPouvoirsIcon}
            title="Autres pouvoirs"
            description="La représentation des femmes dans les autres sphères de pouvoir"
            href="/pouvoirs/autres"
          />
          <CategoryCard
            icon={MondeIcon}
            title={
              <>
                Dans le
                <br />
                monde
              </>
            }
            description="La féminisation du pouvoir à l'échelle européenne et mondiale"
            href="/pouvoirs/monde"
          />
        </div>
      </section>

      {/* 4. Évolution des indicateurs */}
      <EvolutionSection />

      {/* 5. Quote block */}
      <section className="svg-bg svg-purple px-4  lg:px-13 py-15">
        <p className="header-h2 text-white text-center max-w-344 mx-auto">
          {t("quote")}
        </p>
        <div className="flex justify-center mt-8">
          <Link href="/pionnieres" className="button">
            <FemmeMondeIcon />
            <span>Les pionnières</span>
          </Link>
        </div>
      </section>

      {/* 6. Recommandations */}
      <section
        id="recommandations"
        className="bg-white flex flex-col items-center gap-9.5 px-4 lg:px-13 py-15 w-full"
      >
        <div className="flex flex-col items-center gap-2.5 text-center max-w-6xl">
          <h2 className="header-h1 text-foundations-violet-principal break-inside-auto hyphens-auto">
            Recomman&shy;dations
          </h2>

          <div className="body1-medium text-center text-foundations-violet-principal">
            {t.rich("recommandations.summary", richComponents)}
          </div>
        </div>
        {/* Row 1: 3 cards */}
        <div className="flex gap-6.5 flex-wrap justify-center max-w-6xl">
          <RecommendationCard
            title="Cadre législatif"
            color="var(--color-foundations-jaune-oxfam)"
            description={t("recommandations.composantes.cadre_législatif")}
          />
          <RecommendationCard
            title="Formation & mentorat"
            color="var(--color-foundations-violet-principal)"
            description={t("recommandations.composantes.formation_mentorat")}
          />
          <RecommendationCard
            title="Culture organisationnelle"
            color="var(--color-foundations-vert-principal)"
            description={t(
              "recommandations.composantes.culture_organisationnelle",
            )}
          />
          <RecommendationCard
            title="Transparence & données"
            color="var(--color-foundations-orange-site)"
            description={t("recommandations.composantes.transparence_données")}
          />
          <RecommendationCard
            title="Engagements volontaires"
            color="var(--color-foundations-bleu-site)"
            description={t(
              "recommandations.composantes.engagements_volontaires",
            )}
          />
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Gauge from "@/components/Gauge";
import { Tooltip } from "@/components/Tooltip";
import pouvoirData from "@/data/pouvoir.json";

type Pouvoir = "executif" | "parlementaire" | "local" | "autre";

type Stat = { score: number; evolution: number };
type Data = Record<Pouvoir, Stat & { composantes: Record<string, Stat> }>;

const fetchData = async () => {
  return pouvoirData as Data;
};

type CardProps = Stat & {
  pouvoir: Pouvoir;
};

const PouvoirCard = async ({ pouvoir, score, evolution }: CardProps) => {
  const t = await getTranslations(`Dashboard.pouvoir.${pouvoir}`);

  const bgColor = evolution && evolution > 0 ? "bg-green-500" : "bg-red-500";

  return (
    <div className="border-gray-200 border container w-50 flex flex-col p-4">
      <div className="text-[16px] text-[#697077]">{t("title")}</div>
      <div className="flex flex-row items-center">
        <div className="flex-1 text-[#21272A] font-bold text-2xl">{score}%</div>
        <div
          className={`text-right rounded-xl ${bgColor} text-white text-[14px] py-0.5 px-2`}
        >
          {evolution > 0 ? "+" : ""}
          {evolution}%
        </div>
      </div>
    </div>
  );
};

export default async function Page() {
  const data = await fetchData();

  return (
    <div className="flex flex-col flex-1 md:flex-row w-full gap-0 relative overflow-visible">
      {/* Left Part */}
      <div className="flex-1 flex flex-col gap-8 bg-[#513893] p-8 lg:px-14 lg:py-24 md:pr-30 relative">
        <h1 className="text-5xl/tight text-[#CBB8D9] uppercase">
          Présentation de l'Index
        </h1>
        <div className="mt-4 text-lg max-w-sm text-[#E9ECF7]">
          L'index de Féminisation du Pouvoir mesure la représentation des femmes
          dans les différentes instances décisionnelles depuis 2010. <br />
          Cet indicateur composite analyse la présence féminine dans les organes
          éxecutifs, législatifs et locaux pour évaluer l'évolution de la partie
          dans les sphères de pouvoir.
        </div>
        <Link
          href="/methodologie"
          className="mt-4 w-xs p-2 flex items-center justify-center"
        >
          <Tooltip text="Méthodologie de calcul" />
        </Link>
      </div>

      {/* Right Part */}
      <div className="flex-1 flex flex-col bg-gray-000 items-center justify-center relative p-8 md:pl-30">
        <div className="flex-1 flex flex-row">
          {/* Image overlaying between Left and Right Part */}
          <div className="mr-4 hidden md:block absolute left-0 top-0 translate-y-1/3 -translate-x-1/2 ">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/woman_drawing.svg`}
              alt=""
              aria-hidden={true}
              width={426}
              height={426}
              priority
            />
          </div>
          <div className="flex-1">
            <Gauge value={28} label={"Index de\nféminisation du\npouvoir"} />
          </div>
        </div>

        <div className="flex-1 grid lg:grid-cols-2 gap-5 m-5 content-center">
          {Object.entries(data).map(([pouvoir, value]) => (
            <PouvoirCard
              key={pouvoir}
              pouvoir={pouvoir as Pouvoir}
              {...value}
            />
          ))}
        </div>

        <Link
          href="/evolution-donnees"
          className="flex items-center justify-center p-2 underline"
        >
          Voir les évolutions
        </Link>
      </div>
    </div>
  );
}

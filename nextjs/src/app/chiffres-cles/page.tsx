import { getTranslations } from "next-intl/server";
import ArcDiagramPct from "../../components/ArcDiagramPct"
import Link from "next/link";
import Image from "next/image";

type Pouvoir = "executif" | "parlementaire" | "local" | "autre";

type Data = Record<
  Pouvoir,
  { score: number; evolution: number, composantes: Record<string, number> }
>;
const _dummyData = {
  executif: {
    score: 29.61,
    evolution:2.5,
    composantes: {
      gouvernement: 50,
      ministeres_regaliens: 0,
      cabinet_presidence: 35.2,
      cabiner_premier_ministre: 42.9,
      directrices_cabinet_gouvernement: 20,
    },
  },
  parlementaire: {
    score: 28.6,
    evolution:2.5,
    composantes: {
      deputees: 36,
      presidente_commission_an: 37.5,
    },
  },
  local: {
    evolution:2.5,
    score: 24.7,
    composantes: {},
  },
  autre: {
    score: 19.8,
    evolution:-1.2,
    composantes: {},
  },
} satisfies Data;

const fetchData = async () => {
  await new Promise((res) => setTimeout(res, 300));
  return _dummyData;
};

type CardProps = {
  pouvoir: Pouvoir;
  score: number;
  evolution: number;
  composantes: (typeof _dummyData)[Pouvoir]["composantes"];
};

const PouvoirCard = async ({ pouvoir, score, evolution, composantes }: CardProps) => {
  const t = await getTranslations(`Dashboard.pouvoir.${pouvoir}`);

  const bgColor = evolution && evolution > 0 ? "bg-green-500" : "bg-red-500"

  return (
    <div className="border-gray-200 border-2 container flex flex-col p-4">
      <div className = "text-xs">
        {t("title")}
      </div>
      <div className = "text-xs flex flex-row mt-2">
        <div className = "flex-1 text-left p-0.5 pl-2 pr-2">
          {score}%
        </div>
        <div className={`text-right rounded-lg ${bgColor} text-white p-0.5 pl-2 pr-2`}>
          {evolution}%
        </div>
      </div>
    </div>
  );
};

export default async function Page() {
  const data = await fetchData();

  return (
    <div className="flex flex-col gap-8 items-center justify-center font-sans">
        <div className="flex-1 flex-row max-w-6xl md:mt-20">

          {/* First Part */}
          <div className="flex flex-col md:flex-row w-full gap-0 relative overflow-visible">

            {/* Left Part */}
            <div className="flex-1 flex flex-col bg-gray-100 p-8 md:pr-30">
              <h1 className="text-4xl/relaxed h">
                Présentation de l'Index 
              </h1>
              <div className="mt-4 text-lg">
                L'index de Féminisation du Pouvoir mesure
                la représentation des femmes dans les 
                différentes instances décisionnelles depuis 2010. <br/>
                Cet indicateur composite analyse la présence féminine dans les organes
                éxecutifs, législatifs et locaux pour évaluer l'évolution de la partie dans les sphères de pouvoir.
              </div>
              <Link
                href="/methode"
                className="mt-4 w-xs p-2 flex items-center justify-center"
              >
                📄 En savoir plus sur le calcul de l'index
              </Link>
            </div>

            {/* Right Part */}
            <div className="flex-1 flex flex-col bg-gray-000 items-center justify-center relative p-8 md:pl-30">
              <div className="flex-1 flex flex-row">
                {/* Image overlaying between Left and Right Part */}
                <div className="flex-1 mr-4 translate-y-1/8 md:translate-y-1/8 md:absolute md:left-1 md:top-1 md:-translate-x-1/2 ">
                  <Image
                    src="/images/woman_drawing.png"
                    alt="divider"
                    width={300}
                    height={400}
                    priority
                  />
                </div>
                <div className="flex-1">
                  <ArcDiagramPct value={28} radius={90} description={"Index de Féminisation du Pouvoir"} />
                </div>
              </div>
              
              <div className= "flex-1 grid grid-cols-2 gap-5 m-5">
                {Object.entries(data).map(([pouvoir, value]) => (
                  <PouvoirCard key={pouvoir} pouvoir={pouvoir as Pouvoir} {...value} />
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
        </div>
    </div>    
  );
}

import { getTranslations } from "next-intl/server";

type Pouvoir = "executif" | "parlementaire" | "local" | "autre";

type Data = Record<
  Pouvoir,
  { score: number; composantes: Record<string, number> }
>;
const _dummyData = {
  executif: {
    score: 29.61,
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
    composantes: {
      deputees: 36,
      presidente_commission_an: 37.5,
    },
  },
  local: {
    score: 24.7,
    composantes: {},
  },
  autre: {
    score: 19.8,
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
  composantes: (typeof _dummyData)[Pouvoir]["composantes"];
};

const PouvoirCard = async ({ pouvoir, score, composantes }: CardProps) => {
  const t = await getTranslations(`Dashboard.pouvoir.${pouvoir}`);
  return (
    <div className="bg-[#513893] container flex flex-col p-4 rounded-lg text-background">
      <div className="flex flex-row justify-between items-center m-4">
        <div className="text-3xl">{t("title")}</div>
        <div className="text-5xl">{score} %</div>
      </div>
      <div className="grid grid-cols-2 justify-between items-center gap-2 mx-10">
        {Object.entries(composantes).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <div className="text-lg font-bold">{value} %</div>
            <div className=" max-w-xs">{t(`composantes.${key}` as any)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default async function Page() {
  const data = await fetchData();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <div className="grid grid-cols-2 gap-5 m-5">
        {Object.entries(data).map(([pouvoir, value]) => (
          <PouvoirCard key={pouvoir} pouvoir={pouvoir as Pouvoir} {...value} />
        ))}
      </div>
    </div>
  );
}

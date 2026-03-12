import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full max-w-6xl flex-col items-center justify-between py-32 px-4  sm:items-start">
        <div className="flex flex-col gap-8  md:gap-40 md:flex-row ">
          <div className="flex1">
            <h1 className="text-4xl/relaxed h">
              Le pouvoir, nom masculin&nbsp;: l'index de féminisation du pouvoir
            </h1>
            <div className="mt-4 text-lg">
              Une analyse complète de la representation des femmes dans les
              instances de pouvoir en France, en Europe et dans le monde
            </div>
            <Link
              href="/rapport"
              className="mt-4 w-xs h-10 flex items-center justify-center bg-black text-background"
            >
              Télécharger le rapport complet
            </Link>
          </div>
          <div className="flex1">
            <div className="w-125 h-75 bg-gray-500 flex items-center justify-center text-white">
              Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

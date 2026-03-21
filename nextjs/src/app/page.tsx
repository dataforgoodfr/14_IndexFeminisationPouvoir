import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full max-w-6xl flex-col items-start justify-between py-32 px-4 lg:items-center">
        <div className="flex flex-col justify-between gap-8 lg:gap-40 lg:flex-row">
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left ">
            <h1 className="text-4xl/relaxed h font-tstar">
              Le pouvoir, nom masculin&nbsp;: l'index de féminisation du pouvoir
            </h1>
            <div className="mt-4 text-lg">
              Une analyse complète de la representation des femmes dans les
              instances de pouvoir en France, en Europe et dans le monde
            </div>
            <Link
              href="/rapport"
              className="mt-4 w-xs h-10 flex items-center justify-center bg-black text-background font-headline"
            >
              Télécharger le rapport complet
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="h-full w-full min-h-64 bg-gray-500 flex items-center justify-center text-white">
              Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

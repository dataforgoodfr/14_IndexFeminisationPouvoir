import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center font-sans">
      <div className="flex-1 flex-row max-w-6xl md:mt-20">
        {/* First Part */}
        <div className="flex flex-col md:flex-row w-full gap-4 md:gap-0 ">
          {/* Left Part */}
          <div className="flex-1 bg-gray-000 p-8">
            <h1 className="text-4xl/relaxed h">
              Le pouvoir, nom masculin&nbsp;: l'index de féminisation du pouvoir
            </h1>
            <div className="mt-4 text-lg">
              Une analyse complète de la representation des femmes dans les
              instances de pouvoir en France, en Europe et dans le monde
            </div>
            <Link
              href="/rapport"
              className="mt-4 w-xs p-2 flex items-center justify-center bg-black text-background"
            >
              Télécharger le rapport complet
            </Link>
          </div>

          {/* Right Part */}
          <div className="flex-1 flex flex-col bg-gray-100 items-center justify-center p-8">
            <div className="w-75 h-25 bg-gray-500 flex items-center justify-center text-white">
              Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

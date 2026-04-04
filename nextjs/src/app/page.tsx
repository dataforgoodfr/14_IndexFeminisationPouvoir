import Link from "next/link";
import { BookIcon } from "@/components/icons/book";

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-1 bg-foundations-violet-clair">
      <div className="flex w-full max-w-6xl flex-col items-start justify-between py-16 px-4 lg:items-center">
        <div className="flex flex-col justify-between gap-8 lg:gap-40">
          <div className="flex-1 flex flex-col items-center lg:text-left ">
            <h1 className="header-h1 text-foundations-violet-principal text-center">
              Le pouvoir, nom masculin&nbsp;: l'index de féminisation du pouvoir
            </h1>
            <div className="mt-4 header-h4 text-center">
              Une analyse complète de la representation des femmes dans les
              instances de pouvoir en France, en Europe et dans le monde
            </div>
            <div
              className={
                "w-full h-100 lg:w-200 lg:h-200 my-8 bg-foundations-violet-principal text-white text-center p-6"
              }
            >
              Placeholder image
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              <Link
                href="/pouvoirs"
                className="mt-4 button button-primary font-headline"
              >
                <span>Les pouvoirs</span>
              </Link>
              <Link href="/rapport" className="mt-4 button font-headline">
                <BookIcon />
                <span>Lire le rapport</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

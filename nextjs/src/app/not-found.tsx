import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center gap-12 py-12">
      <div className="flex flex-1 flex-col gap-6.5 items-center w-full max-w-148 h-auto">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/inequal.svg`}
          alt=""
          aria-hidden
          width={410}
          height={384}
          className="w-full max-w-100 h-auto"
          priority
        />
        <div className="divider"> </div>
        <h1 className="header-h1 text-center text-foundations-violet-principal">
          la page demandée n'existe pas
        </h1>
        <div className="flex flex-col items-center h-full max-h-85">
          <p className="font-tstar text-foundations-violet-principal text-[214px]/[1.25] font-bold">
            404
          </p>
        </div>
        <Link href="/" className="button button-primary button2-semibold">
          retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

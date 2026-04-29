import Image from "next/image";

export default function UnionEuropeennePage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h2 text-foundations-violet-principal text-center">
          L'union européenne
        </h2>
        <h4 className="header-h3 max-w-205 text-foundations-violet-principal text-center">
          Il a fallu attendre 1989 pour que des femmes siègent à la Commission
          européenne, la Française Christiane Scrivener et la Grecque Vásso
          Papandréou.
        </h4>

        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
        <Image
          src={`/images/evolution-parite-commission-europeenne.webp`}
          alt="Évolution de la parité dans la Commission europeenne"
          aria-hidden
          width={1632}
          height={836}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

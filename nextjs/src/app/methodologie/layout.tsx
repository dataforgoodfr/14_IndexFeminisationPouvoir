import { SectionMethodo } from "@/components/SectionMethodo";

export default function MethodologieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 max-h-[80px] h-full py-[26px] shadow-md">
        <h3 className="header-h3 pl-5 text-foundations-violet-principal uppercase items-start">
          explication de la méthodologie
        </h3>
      </div>
      <div className="flex flex-1 py-[60px]">
        <div className="flex flex-1 flex-col items-center gap-[24px] pb-[30px]">
          <h2 className="header-h2 text-foundations-violet-principal text-center">
            Méthodologie de calcul de l'index
          </h2>
          <div className="flex flex-1 px-[52.5px] gap-[12px]">
            <SectionMethodo label="Méthode" href="/methodologie/methode" />
            <SectionMethodo label="Sources" href="/methodologie/sources" />
            <SectionMethodo
              label="Système d'automatisation"
              href="/methodologie/systeme-automatisation"
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

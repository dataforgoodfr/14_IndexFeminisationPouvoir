import { SectionMethodo } from "@/components/SectionMethodo";

export default function MethodologieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 py-15">
        <div className="flex flex-1 flex-col items-center gap-6 pb-7.5">
          <h2 className="header-h2 text-foundations-violet-principal text-center">
            Méthodologie de calcul de l'index
          </h2>
          <div className="flex flex-1 px-[52.5px] gap-3">
            <SectionMethodo label="Méthode" href="/methodologie" />
            <SectionMethodo label="Sources" href="/methodologie/sources" />
            <SectionMethodo
              label="Système d'automatisation"
              href="/methodologie/automatisation"
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

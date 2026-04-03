import { Hero } from '@/components/Hero';
import { PouvoirLocalIcon } from '@/components/icons/pouvoir-local';
import { PageTitle } from "@/components/PageTitle";
import { PouvoirFigure } from '@/components/PouvoirFigure';

const local = {
  gouvernement: 50,
  postes_regaliens: 0,
  cabinet_president: 35.2,
  cabinet_premier_ministre: 42.9,
  cabinet_gouvernement: 20,
};

export default function Page() {
  const parite =
    Object.values(local).reduce((acc, val) => acc + val, 0) /
    Object.keys(local).length;

  return (
    <>
      <PageTitle title="Pouvoir local" subtitle="Texte à ajouter" />
      <Hero>
        <PouvoirFigure
          valeur={parite}
          icon={PouvoirLocalIcon}
          dateMiseàJour={new Date()}
          texte="Texte à ajouter"
        />
      </Hero>
      <div className="p-8 flex flex-col gap-8">
        
      </div>
    </>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center px-4">
        <div className="flex flex-col gap-4 max-w-296 items-center justify-between py-12 md:items-start">
          <div className="flex flex-col justify-center text-center w-full gap-2">
            <h1 className="text-2xl font-bold">
              Taux de Parité <br />
              Parlementaire
            </h1>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center px-4 border-gray-200 border">
        <div className="flex flex-col gap-4 max-w-296 items-center justify-between py-12 md:items-start">
          <div className="flex flex-col justify-center text-center w-full gap-2">
            <h1 className="text-2xl font-bold">Indicateurs par Institution</h1>
            <p className="text-sm text-[#868686]">
              Principales pistes d'action pour promouvoir la feminisation du
              pouvoir
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-10">
              <ParlementaireCard text="Assemblée nationale">
                45% de femme à l'assemblée nationale
              </ParlementaireCard>
              <ParlementaireCard text="Sénat">
                38% de femme au sénat
              </ParlementaireCard>
              <ParlementaireCard text="Parlement européen">
                32% de femme au parlement européen
              </ParlementaireCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ParlementaireCardProps = {
  text: string;
  children: React.ReactNode;
};

const ParlementaireCard = ({ text, children }: ParlementaireCardProps) => {
  return (
    <div className="flex flex-col p-6 bg-white gap-2 border-gray-200 border rounded-lg ">
      <p className="text-[#868686] text-sm leading-6">{text}</p>
      <div>{children}</div>
    </div>
  );
};

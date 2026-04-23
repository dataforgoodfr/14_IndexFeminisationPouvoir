import { ShortDate } from "@/components/ShortDate";

export default function PortefeuillesMinisterielsPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12 px-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="header-h1 text-foundations-violet-principal text-center">
          Portefeuilles ministériels
        </h2>
        <p className="body2-regular text-black">
          Dernière mise à jour :{" "}
          {/* TODO: */}
          <ShortDate date={new Date()} />
        </p>
        <div className="bg-foundations-violet-clair h-1.5 w-15 rounded-full" />
      </div>
    </div>
  );
}

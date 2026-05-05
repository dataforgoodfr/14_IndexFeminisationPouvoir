import { BlocMethodo } from "@/components/BlocMethodo";
import { DocumentIcon } from "@/components/icons/document";
import { sourceURLs } from "@/components/LiensCTA";

const sources = (record: Record<string, string | null>) => [
  ...new Set(
    Object.values(record).filter((value): value is string => value !== null),
  ),
];

type BlocPouvoirProps = {
  title: string;
  links: Record<string, string | null>;
};

const BlocPouvoir = ({ title, links }: BlocPouvoirProps) => (
  <div className="flex flex-col gap-2">
    <h4 className="header-h4">{title}</h4>
    <ul className="flex flex-col gap-1">
      {sources(links).map((source) => (
        <li key={source}>
          <a
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className="link1-medium"
          >
            {source}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default function Page() {
  return (
    <div className="lg:w-260 flex flex-col gap-10 p-8">
      <BlocMethodo title="Sources" icon={<DocumentIcon />}>
        <div className="flex flex-col gap-4">
          <BlocPouvoir title="Pouvoir exécutif" links={sourceURLs.executif} />
          <BlocPouvoir
            title="Pouvoir parlementaire"
            links={sourceURLs.parlementaire}
          />
          <BlocPouvoir title="Pouvoir local" links={sourceURLs.local} />
          <BlocPouvoir title="Autres pouvoirs" links={sourceURLs.autres} />
          <BlocPouvoir title="Dans le monde" links={sourceURLs.monde} />
          <BlocPouvoir title="Dans le monde" links={sourceURLs.monde} />
        </div>
      </BlocMethodo>
    </div>
  );
}

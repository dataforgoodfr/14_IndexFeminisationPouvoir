import { BlocMethodo } from "@/components/BlocMethodo";
import { DocumentIcon } from "@/components/icons/document";
import { sourceURLs } from "@/components/LiensCTA";

const sources = (record: Record<string, string>) => [
  ...new Set(Object.values(sourceURLs.executif)),
];

export default function Page() {
  return (
    <div className="lg:w-260 flex flex-col gap-10 p-8">
      <BlocMethodo title="Sources" icon={<DocumentIcon />}>
        <div className="flex flex-col gap-2">
          <h4 className="header-h4">Pouvoir exécutif</h4>
          <ul className="flex flex-col gap-1">
            {sources(sourceURLs.executif).map((source) => (
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
      </BlocMethodo>
    </div>
  );
}

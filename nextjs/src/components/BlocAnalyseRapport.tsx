import Link from "next/link";
import { BookIcon } from "./icons/book";

type BlocAnalyseRapportProps = {
  description: string;
};

export const BlocAnalyseRapport = ({
  description,
}: BlocAnalyseRapportProps) => (
  <div className="w-full p-11 bg-foundations-violet-clair flex flex-col items-center justify-center gap-4">
    <div className="max-w-170 text-center flex flex-col items-center justify-center gap-4">
      <p className="body1-regular">{description}</p>
      <p className="body1-medium">Pour en savoir plus :</p>
      <p>
        <Link href="/rapport" className="hidden lg:block button">
          <BookIcon />
          <span>Lire le rapport</span>
        </Link>
      </p>
    </div>
  </div>
);

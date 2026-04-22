import Link from "next/link";
import { LogoOxfamHorizontal } from "@/components/icons/logo-oxfam-horizontal";
import { LogoDataForGood } from "./icons/logo-d4g";

export function Footer() {
  return (
    <footer className="bg-foundations-violet-principal h-24 flex flex-row gap-18 items-center justify-center px-7 py-4 shrink-0">
      <Link
        href="https://www.oxfamfrance.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LogoOxfamHorizontal className="w-39 h-16" aria-label="Oxfam" />
      </Link>
      <p className="body1-medium text-foundations-blanc">
        Contact&nbsp; | &nbsp;Mentions légales
      </p>
      <Link
        href="https://dataforgood.fr"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LogoDataForGood className="w-58 h-12" />
      </Link>
    </footer>
  );
}

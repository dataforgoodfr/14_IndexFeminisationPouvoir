import { LogoOxfamHorizontal } from "@/components/icons/logo-oxfam-horizontal";

export function Footer() {
  return (
    <footer className="bg-foundations-violet-principal flex flex-row gap-[71px] items-center justify-center px-7 py-4 shrink-0">
      <LogoOxfamHorizontal className="w-[70px] h-[70px]" aria-label="Oxfam" />
      <p className="body1-medium text-foundations-blanc">
        Contact&nbsp; | &nbsp;Mentions légales
      </p>
      <p className="body1-medium text-foundations-blanc">Data For Good</p>
    </footer>
  );
}

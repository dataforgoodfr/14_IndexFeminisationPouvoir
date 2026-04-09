import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-foundations-violet-principal flex flex-row gap-[71px] items-center justify-center px-7 py-4 shrink-0">
      <Image
        src="/images/logo-oxfam-horizontal.svg"
        alt="Oxfam"
        width={192}
        height={79}
        className="object-contain"
      />
      <p className="body1-medium text-foundations-blanc">
        Contact&nbsp; | &nbsp;Mentions légales
      </p>
      <p className="body1-medium text-foundations-blanc">Data For Good</p>
    </footer>
  );
}

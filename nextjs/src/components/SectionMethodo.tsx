"use client";
import type { Route } from "next";
import { usePathname } from "next/dist/client/components/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionMethodoProps = {
  label: string;
  href: Route;
};

export const SectionMethodo = ({ label, href }: SectionMethodoProps) => {
  const pathname = usePathname()
    .replace(/\/$/, "")
    .replace(/\/#.*$/, "");
  const activeItem = href
    .replace(/\/$/, "")
    .replace(/\/#.*$/, "")
    .startsWith(pathname);
  return (
    <Link href={href}>
      <p
        className={cn(
          activeItem
            ? "link2-medium  text-foundations-violet-principal underline underline-offset-4"
            : "body2-medium text-foundations-violet-clair",
        )}
      >
        {label}
      </p>
    </Link>
  );
};

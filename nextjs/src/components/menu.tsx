"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { cn } from "@/lib/utils";

type NavigationItem = {
  name: string;
  href: LinkProps["href"];
};

export const Menu: FC<{ items: NavigationItem[] }> = ({ items }) => {
  const pathname = usePathname();
  return (
    <Disclosure as="nav" className="relative border-b border-(--color-border)">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:black/5 hover:text-black focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                data-slot="icon"
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              >
                <path
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                data-slot="icon"
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              >
                <path
                  d="M6 18 18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </DisclosureButton>
          </div>
          <div className="flex flex-1 justify-center items-stretch md:justify-start">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-foreground  text-background flex items-center justify-center">
                IF
              </div>
              <span className="md:hidden xl:block">Index de Féminisation</span>
            </Link>
            <div className="hidden w-full md:ml-6 md:flex justify-between items-center">
              <div className="flex space-x-4 items-center justify-center">
                {items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2 py-2 text-base font-medium ",
                      pathname === item.href
                        ? "bg-black/10 shadow-inner font-semibold transform translate-x-1"
                        : "text-gray-800 hover:bg-black/5 hover:shadow-sm ",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/rapport"
                className="hidden w-36 h-10 xl:flex items-center justify-center bg-black text-background"
              >
                Lire le rapport
              </Link>
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="lg:hidden">
        <div className="space-y-1 pl-2 pr-4 pt-2 pb-3">
          {items.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                pathname === item.href
                  ? "bg-black/10 shadow-inner font-semibold transform translate-x-1"
                  : "text-gray-800 hover:bg-black/5 hover:shadow-sm hover:transform hover:translate-x-0.5",
                "block rounded-md px-3 py-2 text-base font-medium transition-all duration-150 ease-in-out",
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

import type { Metadata } from "next";
import { Lato, OxfamHeadline, OxfamTstarPro } from "./fonts";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { MatomoAnalytics } from "@/components/MatomoAnalytics";
import { Menu, type NavigationItem } from "@/components/menu";
import { PouvoirsSubmenu } from "@/components/PouvoirsSubmenu";

export const metadata: Metadata = {
  title: "Index de Féminisation du Pouvoir",
};

const navigation: NavigationItem[] = [
  {
    name: "En chiffres",
    submenu: <PouvoirsSubmenu />,
  },
  { name: "Pionnières", href: "/pionnieres" },

  { name: "Recommandations", href: "/#recommandations" },
  { name: "Méthode de calcul", href: "/methodologie" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = "";
  const svgRoot = `${basePath}/images/`;
  // On injecte des variables CSS pour les SVG utilisés dans des utilitaires Tailwind
  // afin de régler le problème de base path sur github pages.
  const svgIcons: Record<string, string> = {
    "--hero-svg-url": `url(${svgRoot}hero.svg)`,
    "--inequal-svg-url": `url(${svgRoot}inequal.svg)`,
    "--evolution-red-svg-url": `url(${svgRoot}bg-evolution-red.svg)`,
    "--evolution-green-svg-url": `url(${svgRoot}bg-evolution-green.svg)`,
    "--bg-trees-svg-url": `image-set(url(${svgRoot}bg-trees.webp) type('image/webp'), url(${svgRoot}bg-trees.png) type('image/png'))`,
    "--bg-trees-violet-svg-url": `image-set(url(${svgRoot}bg-trees-violet.webp) type('image/webp'), url(${svgRoot}bg-trees-violet.png) type('image/png'))`,
    "--bg-chiffres-svg-url": `url(${svgRoot}bg-chiffres.svg)`,
    "--inequal-white-svg-url": `url(${svgRoot}inequal-white.svg)`,
    "--equal-white-svg-url": `url(${svgRoot}equal-white.svg)`,
    "--inequal-local-svg-url": `url(${svgRoot}inequal-local.svg)`,
  };

  return (
    <html lang="fr" style={svgIcons} data-scroll-behavior="smooth">
      <body
        className={`${OxfamHeadline.variable} ${OxfamTstarPro.variable} ${Lato.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <NextIntlClientProvider>
            <Menu items={navigation} />
            <main className="flex-1 flex flex-col mt-22.5">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </div>
        {process.env.NODE_ENV === "production" && (
          <Suspense fallback={null}>
            <MatomoAnalytics />
          </Suspense>
        )}
      </body>
    </html>
  );
}

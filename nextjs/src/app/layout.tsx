import type { Metadata, Route } from "next";
import { Lato, OxfamHeadline, OxfamTstarPro } from "./fonts";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "@/components/Footer";
import { Menu } from "@/components/menu";

export const metadata: Metadata = {
  title: "Index de Féminisation du Pouvoir",
};

const navigation: { name: string; href: Route }[] = [
  { name: "Pouvoirs", href: "/pouvoirs" },
  { name: "Recommandations", href: "/recommandations" },
  { name: "Pionnières", href: "/pionnieres" },
  { name: "Méthode de calcul", href: "/methodologie" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const svgRoot = `${basePath}/images/`;
  // On injecte des variables CSS pour les SVG utilisés dans des utilitaires Tailwind
  // afin de régler le problème de base path sur github pages.
  const svgIcons: Record<string, string> = {
    "--hero-svg-url": `url(${svgRoot}hero.svg)`,
    "--inequal-svg-url": `url(${svgRoot}inequal.svg)`,
    "--evolution-red-svg-url": `url(${svgRoot}bg-evolution-red.svg)`,
    "--evolution-green-svg-url": `url(${svgRoot}bg-evolution-green.svg)`,
    "--bg-trees-svg-url": `url(${svgRoot}bg-trees.svg)`,
    "--bg-chiffres-svg-url": `url(${svgRoot}bg-chiffres.svg)`,
    "--inequal-white-svg-url": `url(${svgRoot}inequal-white.svg)`,
    "--equal-white-svg-url": `url(${svgRoot}equal-white.svg)`,
  };

  return (
    <html lang="fr" style={svgIcons}>
      <body
        className={`${OxfamHeadline.variable} ${OxfamTstarPro.variable} ${Lato.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <NextIntlClientProvider>
            <Menu items={navigation} />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}

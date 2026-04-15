import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Lato, OxfamHeadline, OxfamTstarPro } from "./fonts";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "@/components/Footer";
import { Menu } from "@/components/menu";

export const metadata: Metadata = {
  title: "Index de Féminisation du Pouvoir",
};

const navigation = [
  { name: "Chiffres clés", href: "/chiffres-cles/", current: true },
  { name: "Pouvoirs", href: "/pouvoirs/", current: false },
  { name: "Recommandations", href: "/recommandations/", current: false },
  { name: "Méthode de calcul", href: "/methode/", current: false },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const svgRoot = `${basePath}/images/`;
  const cssVariables: CSSProperties &
    Record<"--hero-svg-url" | "--inequal-svg-url", string> = {
    "--hero-svg-url": `url(${svgRoot}hero.svg)`,
    "--inequal-svg-url": `url(${svgRoot}inequal.svg)`,
  };

  return (
    <html lang="fr" style={cssVariables}>
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

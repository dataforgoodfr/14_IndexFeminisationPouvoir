import type { Metadata } from "next";
import { Lato, OxfamHeadline, OxfamTstarPro } from "./fonts";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Menu } from "@/components/menu";

export const metadata: Metadata = {
  title: "Index de Féminisation du Pouvoir",
};

const navigation = [
  { name: "Chiffres clés", href: "/chiffres-cles/", current: true },
  { name: "Explorer les données", href: "/explorer/", current: false },
  { name: "Recommandations", href: "/recommandations/", current: false },
  { name: "Méthode de calcul", href: "/methode/", current: false },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${OxfamHeadline.variable} ${OxfamTstarPro.variable} ${Lato.variable} antialiased`}
      >
        <div className="min-h-screen font-lato">
          <NextIntlClientProvider>
            <Menu items={navigation} />
            <main>{children}</main>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Menu } from "@/components/menu";

const inter = Inter({
  subsets: ["latin"],
});

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
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen">
          <NextIntlClientProvider>
            <Menu items={navigation} />
            <main>{children}</main>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}

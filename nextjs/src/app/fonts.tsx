import localFont from "next/font/local";

export const OxfamHeadline = localFont({
  src: "../../public/fonts/OxfamGlobalHeadline.ttf",
  variable: "--font-oxfam-headline",
});

export const OxfamTstarPro = localFont({
  src: "../../public/fonts/Oxfam_TSTARPRO-Bold.otf",
  variable: "--font-oxfam-tstar-pro",
});

export const Lato = localFont({
  src: [
    {
      path: "../../public/fonts/Lato-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Lato-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Lato-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-lato",
});

import Link from "next/link";
import { LogoOxfamHorizontal } from "@/components/icons/logo-oxfam-horizontal";
import { InfoIcon } from "./icons/info";
import { LogoDataForGood } from "./icons/logo-d4g";
import { BlueskyIcon } from "./icons/socials/bluesky";
import { InstagramIcon } from "./icons/socials/instagram";
import { LinkedinIcon } from "./icons/socials/linkedin";
import { MastodonIcon } from "./icons/socials/mastodon";
import { Tooltip } from "./Tooltip";

export function Footer() {
  return (
    <footer className="bg-foundations-violet-principal h-full lg:h-24 flex flex-col lg:flex-row gap-8 items-center justify-between px-7 py-4 shrink-0">
      <div className="flex-1">
        {/* Oxfam */}
        <Link
          href="https://www.oxfamfrance.org/"
          target="_blank"
          rel="noopener noreferrer"
          title="Oxfam France"
          aria-label="Site d'Oxfam France"
        >
          <LogoOxfamHorizontal className="w-39 h-16" aria-label="Oxfam" />
        </Link>
      </div>
      {/* Contact & Legal */}
      <div className="flex-auto flex flex-col lg:flex-row gap-2 items-center text-foundations-blanc">
        <Link href="/contact" className="link1-medium">
          Contact
        </Link>{" "}
        <span className="hidden lg:block">|</span>
        <Link href="/legal" className="link1-medium text-center lg:text-left">
          Mentions légales & Politique de Confidentialité
        </Link>
      </div>
      {/* Data for good */}
      <div className="flex-1 flex gap-2 items-center">
        <Link
          href="https://dataforgood.fr"
          target="_blank"
          rel="noopener noreferrer"
          title="Data For Good"
          aria-label="Site de Data For Good"
        >
          <LogoDataForGood className="w-58 h-12" />
        </Link>
        <Tooltip
          color="white"
          text={
            <div className="flex flex-col gap-1">
              <p>
                Data For Good est une communauté de 8000 bénévoles qui mettent
                leur temps et leurs compétences au service de l'intérêt général.
              </p>
              <p>
                Nous co-construisons, avec et pour des associations de terrain
                qui défendent la démocratie, la justice sociale et
                l'environnement,
                <br /> les projets numériques dont elles ont besoin, toujours en
                respectant une démarche de sobriété et de communs numériques.
              </p>
              <p>
                Nous portons un plaidoyer qui vise à lutter contre la vision
                hégémonique de la tech et pour un numérique mis au service de
                l'intérêt général.
              </p>
            </div>
          }
          icon={<InfoIcon className="w-6 h-6 fill-white" />}
        />
      </div>
      {/* Social medias */}
      <div className="flex-none flex gap-2 items-center ">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.instagram.com/dataforgoodfr/"
          title="Instagram"
          aria-label="Compte Instagram de Data for Good"
        >
          <InstagramIcon />
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/company/dataforgood/"
          title="LinkedIn"
          aria-label="Compte LinkedIn de Data for Good"
        >
          <LinkedinIcon />
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://bsky.app/profile/dataforgood.fr"
          title="Bluesky"
          aria-label="Compte Bluesky de Data for Good"
        >
          <BlueskyIcon />
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://piaille.fr/@dataforgood"
          title="Mastodon"
          aria-label="Compte Mastodon de Data for Good"
        >
          <MastodonIcon />
        </Link>
      </div>
    </footer>
  );
}

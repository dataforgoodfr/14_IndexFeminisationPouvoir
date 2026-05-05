export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center gap-16 pt-12.5 pb-22.5">
      <div className="flex flex-col items-center gap-2.5">
        <h1 className="header-h1 text-center text-foundations-violet-principal uppercase">
          mentions légales <br /> & politique de confidentialité
        </h1>
        <div className="divider"> </div>
      </div>
      <div className="flex flex-col items-start bg-foundations-violet-tres-clair p-7 max-w-200 w-full">
        <div>
          <p className="body1-regular">
            <b>Ce site est la propriété de :</b>
            <br />
            Oxfam France - 62 bis, avenue Parmentier - 75011 Paris, France
            <br />
            <br />
            <b>Directrice de la publication</b> : Sandra LHOTE - FERNANDES
            <br />
            <b>Réalisation</b> : Data For Good
            <br />
            <b>Hébergement</b> : Github Pages
            <br />
            <b>Propriété intellectuelle - Crédits Photos</b> : Oxfam France
            <br />
            <br />
            <b>
              Politique de confidentialité et Protection des données
              personnelles
            </b>
            <br />
            Le Propriétaire du site se réserve le droit de collecter les
            informations nominatives et les données personnelles vous concernant
            et s'engage à traiter ces données conformément à la réglementation
            en vigueur en matière de protection des données personnelles
            (notamment le RGPD).
            <br />
            <br />
            Conformément à la loi du 6 janvier 1978, vous disposez d'un droit
            d'accès, de rectification et d'opposition aux informations
            nominatives et aux données personnelles vous concernant, en
            contactant notre DPO à l'adresse :{" "}
            <a href="mailto:web@oxfamfrance.org" className="link1-medium">
              web@oxfamfrance.org
            </a>
            <br />
            <br />
            Si vous estimez, après avoir contacté le Propriétaire du site, que
            vos droits « Informatique et Libertés » ne sont pas respectés, vous
            pouvez adresser une réclamation en ligne à la CNIL.
            <br />
            <br />
            <b>Mesure d'audience</b>
            <br />
            Ce site utilise Matomo pour la mesure d'audience, mais ne dépose
            aucun cookie de mesure d'audience sur les navigateurs des visiteurs.
            Matomo est configuré pour anonymiser les adresses IP et ne pas
            utiliser de cookies. Par conséquent, aucune donnée personnelle n'est
            collectée à travers l'utilisation de Matomo sur ce site.{" "}
            <a
              href="https://fr.matomo.org/cookie-consent-banners/"
              className="link1-medium"
            >
              En savoir plus
            </a>
            .
            <br />
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}

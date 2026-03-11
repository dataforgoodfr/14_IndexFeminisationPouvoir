import logging

import scrapy
from scrapy_playwright.page import PageMethod

from ..models import Personne


class Figure2cSpider(scrapy.Spider):
    name = "figure2c"

    start_urls = [
        # TODO: récupérer l'URL du bureau de la législature en cours, qui est ci-dessous écrite en dur.
        "https://www2.assemblee-nationale.fr/17/le-bureau-de-l-assemblee-nationale"
    ]

    # Configuration pour activer Playwright, ce qui est nécessaire si la page est chargée avec
    # des éléments dynamiques ou nécessitants JavaScript ; inutile sinon.
    custom_settings = {
        "DOWNLOAD_HANDLERS": {
            "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
            "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
        },
        "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
        "PLAYWRIGHT_LAUNCH_OPTIONS": {
            "headless": True,  # Mettre False pour voir le navigateur (debug)
        },
    }

    async def start(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url=url,
                callback=self.parse,
                meta=dict(
                    playwright=True,
                    playwright_include_page=True,
                    playwright_page_methods=[
                        PageMethod("wait_for_selector", "#instance-composition-list"),
                    ],
                ),
            )

    async def parse(self, response, **kwargs):
        # IMPORTANT : On ferme la page principale Playwright pour libérer la mémoire
        page = response.meta.get("playwright_page")
        if page:
            await page.close()

        # On cible la balise <a> entière pour extraire le texte ET le lien (href)
        membres = response.css("div.instance-composition-nom a")

        for membre in membres:
            identite_brute = membre.css("::text").get()
            lien_profil = membre.css("::attr(href)").get()

            if not identite_brute or not identite_brute.strip():
                continue

            if lien_profil:
                # On dit à Scrapy de "suivre" ce lien vers le profil détaillé
                yield response.follow(
                    url=lien_profil,
                    callback=self.parse_profile,
                    meta={
                        "identite_brute": identite_brute,
                        # On active Playwright pour la sous-page si besoin
                        "playwright": True,
                        "playwright_include_page": True,
                    },
                )
            else:
                # S'il n'y a pas de lien, on sauvegarde l'item tel quel
                item = Personne(personne_raw_text=identite_brute)
                yield item.model_dump()

    # NOUVELLE MÉTHODE : Pour scrapper les pages individuelles des députés
    async def parse_profile(self, response):
        # On ferme la page de profil pour libérer la RAM
        page = response.meta.get("playwright_page")
        if page:
            await page.close()

        # On récupère le nom brut qu'on avait mis en soute (dans le 'meta') depuis la page principale
        identite_brute = response.meta.get("identite_brute")

        # Sélecteurs des champs à extraire
        groupe_politique_libelle = response.css("a.h4._colored.link::text").get()
        role = response.css("span.h4._colored-primary._pt-small._regular::text").get()
        circonscription = response.css("span._big::text").get()

        # Nettoyage des espaces résiduels (si la donnée a été trouvée)
        groupe_politique_libelle = (
            groupe_politique_libelle.strip() if groupe_politique_libelle else None
        )
        role = role.strip() if role else None
        circonscription = circonscription.strip() if circonscription else None

        try:
            # On instancie le modèle avec toutes les données enrichies
            item = Personne(
                personne_raw_text=identite_brute,
                groupe_politique_libelle=groupe_politique_libelle,
                poste_libelle=role,
                zone_geographique_libelle=circonscription,
                zone_geographique_type="circonscription",
            )
            yield item.model_dump(
                exclude={
                    "personne_raw_text",
                    "personne_nom_complet",
                    "personne_civilite",
                }
            )
        except Exception as e:
            logging.warning(f"Erreur Pydantic sur le profil de {identite_brute} : {e}")

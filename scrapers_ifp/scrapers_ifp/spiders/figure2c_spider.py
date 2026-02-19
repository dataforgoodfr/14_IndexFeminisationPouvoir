import scrapy
from scrapy_playwright.page import PageMethod
from ..models import Personne
import logging


class Figure2cSpider(scrapy.Spider):
    name = "figure2c"

    # Configuration pour activer Playwright, ce qui est nécessaire si la page est chargée avec
    # des éléments dynamiques ou nécessitants JavaScript ; inutile sinon.
    custom_settings = {
        'DOWNLOAD_HANDLERS': {
            "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
            "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
        },
        'TWISTED_REACTOR': "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
        'PLAYWRIGHT_LAUNCH_OPTIONS': {
            "headless": True,  # Mettre False pour voir le navigateur (debug)
        }
    }

    async def start(self):
        urls = [
            'https://www2.assemblee-nationale.fr/17/le-bureau-de-l-assemblee-nationale',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse,
                                 # Cet argument meta n'est utile que si Playwright est utilisé.
                                 meta=dict(
                                     playwright=True,
                                     playwright_include_page=True,
                                     playwright_page_methods=[
                                         # On attend qu'un élément identifié soit disponible sur la page.
                                         PageMethod("wait_for_selector", "#instance-composition-list"), ]
                                 ), )

    async def parse(self, response, **kwargs):
        # Lors d'une première exploration, utiliser les lignes suivantes pour sauvegarder la page dans un fichier.
        # filename = f"data/raw/{self.name}.html"
        # os.makedirs(os.path.dirname(filename), exist_ok=True)
        # with open(filename, 'wb') as f:
        #     f.write(response.body)
        # self.log('Saved file %s' % filename)

        # On cible toutes les divs qui ont la classe "instance-composition-nom"
        # Puis on récupère le texte de la balise <a>.

        identites_brutes = response.css('div.instance-composition-nom a::text').getall()

        for identite_brute in identites_brutes:
            if not identite_brute.strip():
                continue

            try:
                item = Personne(personne_raw_text=identite_brute)
                yield item.model_dump()
            except Exception as e:
                logging.warning(f"Erreur Pydantic : {e}")

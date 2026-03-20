import scrapy
from scrapy.http import TextResponse

from ..models import Personne


class Figure1cSpider(scrapy.Spider):
    name = "figure1c"

    start_urls = [
        "https://www.elysee.fr/la-presidence/cabinet-du-president-de-la-republique-et-services-de-l-elysee"
    ]

    def clean(self, str: str):
        return (
            str.replace(" ", " ")
            .replace("’", "'")
            .replace("–", "-")
            .replace(":", "")
            .strip()
        )

    async def parse(self, response: TextResponse, **kwargs):

        # parfois la fonction est sur 2 lignes / paragraphes
        fonction_split = ""

        for p in response.css("main h2 ~ *"):
            results = list(map(self.clean, p.css("::text").getall()))
            if len(results) == 1:
                fonction_split = results[0]
                continue
            if len(results) != 2:
                self.logger.warning(
                    f"Unexpected number of results: {len(results)} - {results}"
                )
                continue
            fonction, nom = results
            if len(fonction_split) > 0:
                fonction = f"{fonction_split} {fonction}"
                fonction_split = ""

            self.logger.info(f"Fonction : {fonction} - Nom : {nom}")
            yield Personne(
                personne_raw_text=nom,
                poste_libelle=fonction,
            )

from urllib.parse import urlencode

import scrapy
import scrapy.http

from ..models import Personne


# Spider basée sur wikidata pour extraire les chefs d'état et de gouvernement.
class DirigeantsBaseSpider(scrapy.Spider):
    # to override in subclasses
    libellé_poste = ""
    wikidata_id = ""

    start_urls = ["https://query.wikidata.org/sparql?"]
    custom_settings = {
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "ROBOTSTXT_OBEY": False,
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        sparql_query = (
            """
SELECT
  ?countryLabel
  ?countryCode
  ?personLabel
  ?personGenderLabel
WHERE {
  ?country wdt:P31 wd:Q3624078;
           wdt:P297 ?countryCode.

  OPTIONAL {
    ?country wdt:%s ?person.
    OPTIONAL { ?person wdt:P21 ?personGender. }
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "fr,[AUTO_LANGUAGE],en".
  }
}
ORDER BY ?countryCode
"""
            % self.wikidata_id
        )

        print(f"SPARQL Query for {self.name}:\n{sparql_query}")

        self.start_urls = [
            self.start_urls[0] + urlencode({"query": sparql_query, "format": "json"})
        ]

    def parse(self, response: scrapy.http.TextResponse):
        data = response.json()["results"]["bindings"]
        for item in data:
            self.log(f"Traitement de l'item: {item}")
            country_code = item.get("countryCode", {}).get("value")
            personLabel = item.get("personLabel", {}).get("value")
            gender = item.get("personGenderLabel", {}).get("value")

            yield Personne(
                personne_raw_text=personLabel or "",
                poste_libelle=self.libellé_poste,
                zone_geographique_libelle=country_code,
                zone_geographique_type="pays",
                personne_genre="M"
                if gender == "masculin"
                else "F"
                if gender == "féminin"
                else "U",
            )


class ChefsEtatSpider(DirigeantsBaseSpider):
    name = "chefs_etats"
    libellé_poste = "Chef d'état"
    wikidata_id = "P35"


class ChefsGouvernementSpider(DirigeantsBaseSpider):
    name = "chefs_gouvernement"
    libellé_poste = "Chef de gouvernement"
    wikidata_id = "P6"

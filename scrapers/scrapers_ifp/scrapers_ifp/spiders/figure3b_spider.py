import json
from urllib.parse import urlencode
import scrapy
from scrapy.http import TextResponse

from ..models import Personne


class Figure3bSpider(scrapy.Spider):
    name = "figure3b"
    description = "Femmes présidant une commissions au Sénat"

    start_urls = ["https://data.senat.fr/data/senateurs/ODSEN_CUR_COMS.json"]

    async def parse(self, response: TextResponse):
        json_response = response.json()
        results = json_response.get("results", [])
        for result in results:
            nom = result.get("Nom_usuel")
            prenom = result.get("Prenom_usuel")
            fonction = result.get("Fonction")
            qualite = result.get("Qualite")
            nom_commission = result.get("Nom_commission")
            type_commission = result.get("Type_commission")

            if type_commission != "Commission permanente":
                continue

            if fonction != "Président" and fonction != "Présidente":
                continue

            item = Personne(
                personne_raw_text=f"{qualite} {prenom} {nom}",
                personne_nom_complet=f"{qualite} {prenom} {nom}",
                personne_prenom=prenom,
                personne_nom=nom,
                personne_civilite=qualite,
                poste_libelle=nom_commission,
            )
            yield item.model_dump()

import json
from urllib.parse import urlencode
import scrapy
from scrapy.http import TextResponse

from ..models import Personne


class Figure5cSpider(scrapy.Spider):
    name = "figure5c"
    description = "Femmes directrices de cabinet des mairies des préfectures en France"
    current_offset = 0

    params = {
        "where": 'type_organisme="Préfecture, sous-préfecture"',
        "select": "affectation_personne,id,type_organisme,code_insee_commune,url_service_public,adresse",
        "limit": 100,
    }
    start_urls = [
        "https://api-lannuaire.service-public.gouv.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/records"
    ]

    grades_dir_cab = ["directrice", "directeur", "sous-préfète", "sous-préfet"]

    async def start(self):
        url = f"{self.start_urls[0]}?{urlencode(self.params)}"
        yield scrapy.Request(url=url, callback=self.parse)

    async def parse(self, response: TextResponse):
        json_response = response.json()
        results = json_response.get("results", [])
        for result in results:
            adresse_list = json.loads(result.get("adresse", "[]"))
            commune = None
            # code_postal = None
            if len(adresse_list) > 0:
                adresse = adresse_list[0]
                commune = adresse.get("nom_commune")
                # code_postal = adresse.get("code_postal")

            affectations = json.loads(result.get("affectation_personne"))
            for affectation in affectations:
                personne = affectation.get("personne")
                fonction = affectation.get("fonction")
                grade = personne.get("grade")
                nom = personne.get("nom")
                prenom = personne.get("prenom")
                civilite = personne.get("civilite")

                # TODO à affiner !
                if fonction not in [
                    "Directeur de cabinet",
                    "Directrice de cabinet",
                ] and grade not in ["sous-préfet", "sous-préfète"]:
                    continue

                item = Personne(
                    personne_raw_text=f"{civilite} {prenom} {nom}",
                    personne_nom_complet=f"{civilite} {prenom} {nom}",
                    personne_prenom=prenom,
                    personne_nom=nom,
                    personne_civilite=civilite,
                    # TODO à matcher au nom du département
                    zone_geographique_libelle=commune,
                    zone_geographique_type="préfecture",
                    poste_libelle=fonction,
                )
                yield item.model_dump()
                break

        # Pagination
        if len(results) > 0:
            self.current_offset += len(results)
            params = self.params.copy()
            params["offset"] = self.current_offset
            url = f"{self.start_urls[0]}?{urlencode(params)}"
            yield scrapy.Request(url=url, callback=self.parse)

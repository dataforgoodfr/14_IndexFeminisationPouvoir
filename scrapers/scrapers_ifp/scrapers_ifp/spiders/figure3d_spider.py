import scrapy
from scrapy.http import TextResponse

from ..models import Personne


class Figure3dSpider(scrapy.Spider):
    name = "figure3d"
    description = "Femmes présidant un groupe au Sénat"

    start_urls = ["https://data.senat.fr/data/senateurs/ODSEN_HISTOGROUPES.json"]
    fonctions = ["Président", "Présidente", "Délégué", "Déléguée"]

    async def parse(self, response: TextResponse):
        json_response = response.json()
        results = json_response.get("results", [])
        for result in results:
            nom = result.get("Nom")
            prenom = result.get("Prenom")
            groupe = result.get("Nom_court_du_groupe_politique")
            fonction = result.get("Nom_court_fonction")
            date_fin = result.get("Date_de_fin_de_la_fonction")

            if date_fin is not None:
                continue
            if fonction not in self.fonctions:
                continue

            # TODO civilté non disponible, à déterminer à partir d'autres sources du Sénat
            item = Personne(
                personne_raw_text=f"{prenom} {nom}",
                personne_nom_complet=f"{prenom} {nom}",
                personne_prenom=prenom,
                personne_nom=nom,
                poste_libelle=groupe,
            )
            yield item.model_dump()

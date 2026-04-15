import scrapy
from scrapy.http import TextResponse

from ..models import Personne


class Figure3cSpider(scrapy.Spider):
    name = "figure3c"
    description = "Femmes au sein du bureau du Sénat"

    start_urls = ["https://data.senat.fr/data/senateurs/ODSEN_GENERAL.json"]

    async def parse(self, response: TextResponse):
        json_response = response.json()
        results = json_response.get("results", [])
        for result in results:
            nom = result.get("Nom_usuel")
            prenom = result.get("Prenom_usuel")
            qualite = result.get("Qualite")
            groupe = result.get("Groupe_politique")
            fonction = result.get("Fonction_au_Bureau_du_Senat")
            date_deces = result.get("Date_de_deces")
            etat = result.get("Etat")

            if date_deces is not None:
                continue
            if etat == "ANCIEN":
                continue
            if fonction is None:
                continue

            item = Personne(
                personne_raw_text=f"{qualite} {prenom} {nom}",
                personne_nom_complet=f"{prenom} {nom}",
                personne_prenom=prenom,
                personne_nom=nom,
                personne_civilite=qualite,
                poste_libelle=fonction,
                groupe_politique_libelle=groupe,
            )
            yield item.model_dump()

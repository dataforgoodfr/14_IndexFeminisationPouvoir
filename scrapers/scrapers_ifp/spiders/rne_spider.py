from urllib.parse import urlencode
import scrapy
from scrapy.http import TextResponse

from ..static_data import prefectures


class BaseRneSpider(scrapy.Spider):
    """
    Classe de base pour extraire les données du RNE via l'API Tabulaire de data.gouv.fr.
    Les classes filles doivent définir 'name' et 'resource_filter'.
    """

    start_urls = [
        "https://www.data.gouv.fr/api/1/datasets/repertoire-national-des-elus-1/"
    ]

    # Filtre de sélection de la ressource nécessaire définie dans la classe fille
    resource_filter: str = ""

    # Filtres spécifiques à la ressource. À définir dans les classes filles si nécessaire
    other_filters: dict = {}

    custom_settings = {
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    async def parse(self, response: TextResponse, **kwargs):
        data = response.json()
        resource_id = None

        # Recherche de la ressource spécifique selon le filtre défini dans la classe fille
        for resource in data.get("resources", []):
            title = resource.get("title", "").lower()
            # On vérifie si le filtre est présent dans le titre et si c'est un CSV
            if self.resource_filter.lower() in title and title.endswith(".csv"):
                resource_id = resource.get("id")
                break

        if resource_id:
            self.logger.info(f"🎯 [{self.name}] ID trouvé : {resource_id}")
            params = self.other_filters.copy()
            params["page_size"] = 200
            api_url = f"https://tabular-api.data.gouv.fr/api/resources/{resource_id}/data/?{urlencode(params)}"

            yield scrapy.Request(url=api_url, callback=self.parse_api_data)
        else:
            self.logger.error(
                f"❌ [{self.name}] Ressource '{self.resource_filter}' introuvable."
            )

    async def parse_api_data(self, response: TextResponse):
        json_response = response.json()
        lignes = json_response.get("data", [])

        for ligne in lignes:
            yield ligne

        # Gestion de la pagination via les liens fournis par l'API
        next_url = json_response.get("links", {}).get("next")
        if next_url:
            yield scrapy.Request(url=next_url, callback=self.parse_api_data)


# --- SPIDERS SPÉCIFIQUES ---


# Sénateurs
class RneSenateursSpider(BaseRneSpider):
    name = "figure3a"
    resource_filter = "elus-senateurs-sen"


# Parlement européen
class RneElusParlementEuropeenSpider(BaseRneSpider):
    name = "figure4"
    resource_filter = "elus-representants-Parlement-européen-rpe"


# Maire
class RneMairesSpider(BaseRneSpider):
    name = "figure5a"
    resource_filter = "elus-maires-mai"


# Maire de préfecture
class RneMairesPrefecturesSpider(BaseRneSpider):
    name = "figure5b"
    resource_filter = "elus-maires-mai"
    other_filters = {"Code de la commune__in": ",".join(prefectures.keys())}


# Présidentes de département
class RneConseillersDepartementauxSpider(BaseRneSpider):
    name = "figure6a"
    resource_filter = "elus-conseillers-departementaux"
    other_filters = {
        "Libellé de la fonction__exact": "Président du conseil départemental"
    }


# Présidentes de région
class RneConseillersRegionauxSpider(BaseRneSpider):
    name = "figure7a"
    resource_filter = "elus-conseillers-regionaux"
    other_filters = {"Libellé de la fonction__exact": "Président du conseil régional"}

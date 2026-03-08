import scrapy
from scrapy.http import TextResponse


class BaseRneSpider(scrapy.Spider):
    """
    Classe de base pour extraire les données du RNE via l'API Tabulaire de data.gouv.fr.
    Les classes filles doivent définir 'name' et 'resource_filter'.
    """

    # L'URL du dataset parent est commune à tous
    dataset_api_url: str = (
        "https://www.data.gouv.fr/api/1/datasets/repertoire-national-des-elus-1/"
    )

    # Le filtre pour sélectionner la ressource spécifique dans le dataset
    resource_filter: str = ""

    custom_settings = {
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    async def start(self):
        yield scrapy.Request(url=self.dataset_api_url, callback=self.parse_dataset)

    async def parse_dataset(self, response: TextResponse):
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
            api_url = f"https://tabular-api.data.gouv.fr/api/resources/{resource_id}/data/?page_size=200"
            yield scrapy.Request(url=api_url, callback=self.parse_api_data)
        else:
            self.logger.error(
                f"❌ [{self.name}] Ressource '{self.resource_filter}' introuvable."
            )

    async def parse_api_data(self, response: TextResponse):
        json_response = response.json()
        lignes = json_response.get("data", [])

        for ligne in lignes:
            # On ajoute le nom du scraper dans les données pour s'y retrouver à l'export
            ligne["source_scraper"] = self.name
            yield ligne

        # Gestion de la pagination via les liens fournis par l'API
        next_url = json_response.get("links", {}).get("next")
        if next_url:
            yield scrapy.Request(url=next_url, callback=self.parse_api_data)


# --- SPIDERS SPÉCIFIQUES ---


# Députés
class RneDeputesSpider(BaseRneSpider):
    name = "figure2a"
    resource_filter = "elus-deputes-dep"


# Sénateurs
class RneSenateursSpider(BaseRneSpider):
    name = "figure3a"
    resource_filter = "elus-senateurs-sen"


# Conseillers départementaux
class RneConseillersDepartementauxSpider(BaseRneSpider):
    name = "figure6a"
    resource_filter = "elus-conseillers-departementaux"
    # TODO: n'extraire que les président·e·s de départements

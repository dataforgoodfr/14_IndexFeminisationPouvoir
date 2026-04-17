import scrapy
from scrapy.http import TextResponse

from ..models import Personne


class Figure3dSpider(scrapy.Spider):
    name = "figure3d"
    description = "Femmes présidant un groupe au Sénat"

    start_urls = [
        "https://data.senat.fr/data/senateurs/ODSEN_GENERAL.json",
        "https://data.senat.fr/data/senateurs/ODSEN_HISTOGROUPES.json",
    ]
    fonctions = ["Président", "Présidente", "Délégué", "Déléguée"]

    matricule_to_civilite = {}

    async def start(self):
        yield scrapy.Request(url=self.start_urls[0], callback=self.parse_civilites)
        yield scrapy.Request(url=self.start_urls[1], callback=self.parse_membres_bureau)

    async def parse_civilites(self, response: TextResponse):
        json_response = response.json()
        results = json_response.get("results", [])
        for result in results:
            matricule = result.get("Matricule")
            civilite = result.get("Qualite")
            self.matricule_to_civilite[matricule] = civilite

    async def parse_membres_bureau(self, response: TextResponse):
        json_response = response.json()
        results = json_response.get("results", [])
        for result in results:
            matricule = result.get("Matricule")
            nom = result.get("Nom")
            prenom = result.get("Prenom")
            groupe = result.get("Nom_court_du_groupe_politique")
            fonction = result.get("Nom_court_fonction")
            date_fin = result.get("Date_de_fin_de_la_fonction")

            if date_fin is not None:
                continue
            if fonction not in self.fonctions:
                continue

            civilite = self.matricule_to_civilite.get(matricule)
            if not civilite:
                self.logger.warning(
                    f"Matricule {matricule} non trouvé dans les civilités"
                )

            item = Personne(
                personne_raw_text=f"{civilite} {prenom} {nom}",
                personne_nom_complet=f"{prenom} {nom}",
                personne_civilite=civilite,
                personne_prenom=prenom,
                personne_nom=nom,
                poste_libelle=groupe,
            )
            # TODO: voir pourquoi dans le fichier de sortie, le middleware scrapy ne renvoie pas de start_urls
            yield item

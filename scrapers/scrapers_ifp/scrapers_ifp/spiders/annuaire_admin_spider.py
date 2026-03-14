import json
from urllib.parse import urlencode
import scrapy
from scrapy.http import TextResponse

from ..models import Personne


# https://api-lannuaire.service-public.fr/explore/dataset/api-lannuaire-administration/api/
class BaseAnnuaireSpider(scrapy.Spider):
    typeOrganisme = ""
    fonctions: list[str] = []
    fonctions_exclues: list[str] = []
    zone_geographique_type = ""

    current_offset = 0
    params = {
        "select": "affectation_personne,id,type_organisme,code_insee_commune,url_service_public,adresse",
        "limit": 100,
    }
    start_urls = [
        "https://api-lannuaire.service-public.gouv.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/records"
    ]

    def getUrl(self):
        params = self.params.copy()
        params["where"] = f'type_organisme="{self.typeOrganisme}"'
        params["offset"] = self.current_offset
        return f"{self.start_urls[0]}?{urlencode(params)}"

    async def start(self):
        yield scrapy.Request(url=self.getUrl(), callback=self.parse)

    async def parse(self, response: TextResponse):
        json_response = response.json()
        results = json_response.get("results", [])
        for result in results:
            try:
                for item in self.parse_personne(result):
                    yield item
            except Exception as e:
                self.logger.error(f"Error processing result {result}: {e} ")
                continue

        # Pagination
        if len(results) > 0:
            self.current_offset += len(results)
            yield scrapy.Request(url=self.getUrl(), callback=self.parse)

    def parse_personne(
        self,
        result: dict,
    ):
        adresse_list = json.loads(result.get("adresse", "[]") or "[]")
        affectations = json.loads(result.get("affectation_personne", "[]") or "[]")
        for affectation in affectations:
            personne = affectation.get("personne")
            fonction = affectation.get("fonction")
            nom = personne.get("nom")
            prenom = personne.get("prenom")
            civilite = personne.get("civilite")

            if not nom and not prenom and not civilite:
                return False

            if fonction not in self.fonctions:
                continue

            adresse = adresse_list[0] if len(adresse_list) > 0 else {}
            item = Personne(
                personne_raw_text=f"{civilite} {prenom} {nom}",
                personne_nom_complet=f"{civilite} {prenom} {nom}",
                personne_prenom=prenom,
                personne_nom=nom,
                personne_civilite=civilite,
                zone_geographique_libelle=self.getZoneGeographiqueLibelle(adresse),
                zone_geographique_type=self.zone_geographique_type,
                poste_libelle=fonction,
            )
            yield item.model_dump()
            break

    def getZoneGeographiqueLibelle(self, adresse: dict):
        return ""


# Directeurs et Directrices de cabinet des mairies des préfectures en France
class Figure5cSpider(BaseAnnuaireSpider):
    name = "figure5c"

    typeOrganisme = "Préfecture, sous-préfecture"
    fonctions = ["Directeur de cabinet", "Directrice de cabinet"]

    zone_geographique_type = "préfecture"

    # TODO à matcher au nom du département
    def getZoneGeographiqueLibelle(self, adresse: dict):
        return adresse.get("nom_commune", "")


# Préfets et préfètes
class Figure9Spider(BaseAnnuaireSpider):
    name = "figure9"

    typeOrganisme = "Préfecture, sous-préfecture"
    fonctions = ["Préfet", "Préfète"]

    zone_geographique_type = "préfecture"

    # TODO à matcher au nom du département
    def getZoneGeographiqueLibelle(self, adresse: dict):
        return adresse.get("nom_commune", "")


# Figure partielle, voir Figure10Spider
class Figure10PaysSpider(BaseAnnuaireSpider):
    typeOrganisme = "Ambassade ou mission diplomatique"
    fonctions = ["Ambassadeur", "Ambassadrice"]
    zone_geographique_type = "pays"

    def getZoneGeographiqueLibelle(self, adresse: dict):
        return adresse.get("pays", "")


# Figure partielle, voir Figure10Spider
class Figure10OrganisationsSpider(BaseAnnuaireSpider):
    fonctions = [
        "Ambassadeur",
        "Ambassadrice",
        "Représentant permanent",
        "Représentante permanente",
    ]
    zone_geographique_type = "organisation internationale"

    def getZoneGeographiqueLibelle(self, adresse: dict):
        return adresse.get("pays", "")

    async def start(self):
        params = self.params.copy()
        organisations = [
            #  Représentation permanente de la France auprès de l'Organisation des Nations unies - New York
            '"264698f7-fa26-4b11-86e6-18a55aab7f4b"',
            #  Représentation permanente de la France auprès de l'Organisation météorologique mondiale - Genève
            '"3f9197ef-65bc-4d7f-9116-0fa5fdd213aa"',
            #  Délégation permanente de la France auprès de l'Organisation des Nations unies pour l'éducation, la science et la culture - Paris
            '"5a417930-9e04-4b72-9ca1-ac12442d3a99"',
            #  Représentation permanente de la France auprès de l'Organisation de coopération et de développement économiques - Paris
            '"3febdfff-b888-4764-bae2-be79058a11ab"',
            #  Représentation permanente de la France auprès de l'Office des Nations unies et des Organisations internationales - Vienne
            '"7e983ada-c4ac-4d95-a45c-0a05b5c6a470"',
            #  Représentation permanente de la France auprès de l'Organisation maritime internationale (OMI) - Londres
            '"9b85d991-86b9-410f-bb8b-23f2c69b02cb"',
            #  Représentation permanente de la France auprès du Conseil de l'Europe - Strasbourg
            '"5994a151-7a35-4f77-95da-ba8ed17394af"',
            #  Représentation permanente de la France auprès de l'Organisation pour l'interdiction des armes chimiques (OIAC) - La Haye
            '"eb87d261-f431-49f6-bfb9-5b86c2b8b3e6"',
            #  Représentation permanente de la France auprès de l'Organisation des Nations unies - Nairobi
            '"2d56fbc6-a2d2-4e1f-b37b-5221ee2e16d9"',
            #  Représentation permanente de la France auprès de l'Organisation de l'aviation civile internationale (OACI) - Montréal
            '"86400472-30a4-47c0-9964-5e65be480150"',
            #  Représentation de la France auprès de la Communauté du Pacifique - Nouméa
            '"fc0c04ba-ff00-4929-95c0-2deae123a1b6"',
            #  Représentation permanente de la France auprès de l'Organisation pour la sécurité et la coopération en Europe - Vienne
            '"0b920c1b-6128-4c98-a5b4-1fb9a3d9204e"',
            # Représentation permanente de la France auprès de la Conférence du désarmement - Genève
            '"b519d1a0-2bfe-45e1-a363-51cfe4fbf2a4"',
            # Représentation permanente de la France auprès de l'Office des Nations unies - Genève
            '"48bafbe1-3db1-4a78-9c14-6ea0d3269b9d"',
            # Représentation permanente de la France auprès des institutions des Nations unies pour l'alimentation et l'agriculture - Rome
            '"4e6af2c0-863e-4b47-b033-075bbbc62398"',
        ]
        params["where"] = f"id in ({','.join(organisations)})"
        yield scrapy.Request(
            url=self.start_urls[0] + "?" + urlencode(params),
            callback=self.parse,
        )


# Ambassadeurs et Ambassadrices
class Figure10Spider(BaseAnnuaireSpider):
    name = "figure10"

    async def start(self):
        async for item in Figure10PaysSpider(self.name).start():
            yield item
        async for item in Figure10OrganisationsSpider(self.name).start():
            yield item

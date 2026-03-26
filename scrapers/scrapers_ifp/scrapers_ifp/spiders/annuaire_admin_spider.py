import json
from urllib.parse import urlencode
import scrapy
from scrapy.http import TextResponse

from ..models import Personne
from ..static_data import prefectures


def addQuotes(s: str):
    return f'"{s}"'


# https://api-lannuaire.service-public.fr/explore/dataset/api-lannuaire-administration/api/
class BaseAnnuaireSpider(scrapy.Spider):
    where: str = ""
    fonctions: list[str] = []
    zone_geographique_type = ""

    # spécifie si on recherche plus d'une personne par organisme
    stop_at_one = True

    current_offset = 0
    params = {
        "select": "nom,affectation_personne,id,type_organisme,code_insee_commune,url_service_public,adresse,hierarchie",
        "limit": 100,
    }
    start_urls = [
        "https://api-lannuaire.service-public.gouv.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/records"
    ]

    def getUrl(self):
        params = self.params.copy()
        params["offset"] = self.current_offset
        params["where"] = self.where
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
        affectations = json.loads(result.get("affectation_personne", "[]") or "[]")
        fonctions_trouvees = []
        for affectation in affectations:
            personne = affectation.get("personne")
            fonction = affectation.get("fonction")
            nom = personne.get("nom")
            prenom = personne.get("prenom")
            civilite = personne.get("civilite")

            if not nom and not prenom and not civilite:
                continue

            if not self.matchFonction(fonction, result.get("nom", "")):
                fonctions_trouvees.append(fonction)
                continue

            item = Personne(
                personne_raw_text=f"{civilite} {prenom} {nom}",
                personne_nom_complet=f"{civilite} {prenom} {nom}",
                personne_prenom=prenom,
                personne_nom=nom,
                personne_civilite=civilite,
                zone_geographique_libelle=self.getZoneGeographiqueLibelle(result),
                zone_geographique_type=self.zone_geographique_type,
                poste_libelle=fonction,
            )
            yield item.model_dump()
            if self.stop_at_one:
                return

        self.logger.warning(
            f"Aucune personne trouvée pour {result.get('nom')} : {set(fonctions_trouvees)}",
        )

    def getZoneGeographiqueLibelle(self, result: dict):
        return ""

    def getAddresse(self, result: dict):
        adresse_list = json.loads(result.get("adresse", "[]") or "[]")
        adresse = adresse_list[0] if len(adresse_list) > 0 else {}
        return adresse

    def matchFonction(self, fonction: str, nom_organisme: str):
        return fonction in self.fonctions


# Membres du cabinet du président de la république
# NB: on utilise la hierarchie pour récupérer tous les pôles du cabinet
class Figure1cSpider(BaseAnnuaireSpider):
    name = "figure1c"

    where = 'nom="Cabinet du président de la République"'
    zone_geographique_type = ""
    stop_at_one = False

    def matchFonction(self, fonction: str, nom_organisme: str):
        return True

    async def parse(self, response: TextResponse):
        json_response = response.json()
        results = json_response.get("results", [])
        for result in results:
            for item in self.parse_personne(result):
                yield item

            hierarchie = json.loads(result.get("hierarchie", "[]") or "[]")
            if len(hierarchie) == 0:
                continue
            ids = map(lambda x: x.get("service"), hierarchie)
            params = self.params.copy()
            params["where"] = f"id in ({','.join(map(addQuotes, ids))})"
            url = f"{self.start_urls[0]}?{urlencode(params)}"
            yield scrapy.Request(
                url=url,
                # on utilise le callback de la classe parente pour éviter de faire une récursion infinie
                # callback=super(BaseAnnuaireSpider, self).parse,
                callback=self.parse,
            )


# Membres du cabinet du premier ministre
class Figure1dSpider(BaseAnnuaireSpider):
    name = "figure1d"

    where = 'nom="Cabinet du Premier ministre"'
    stop_at_one = False

    def matchFonction(self, fonction: str, nom_organisme: str):
        return True


# Directrices de cabinet au sein du gouvernement
# NB: on utilise la hierarchie pour récupérer tous les cabinets ministériels
class Figure1eSpider(BaseAnnuaireSpider):
    name = "figure1e"

    fonctions = [
        "Directeur de cabinet",
        "Directeur du cabinet",
        "Directrice de cabinet",
        "Directrice du cabinet",
    ]
    where = 'nom="Gouvernement (Premier ministre et ministères)"'

    def getZoneGeographiqueLibelle(self, result: dict):
        return result.get("nom", "")

    def parse(self, response: TextResponse):
        json_response = response.json()
        gouvernement = json_response.get("results", [])[0]

        hierarchie = json.loads(gouvernement.get("hierarchie", "[]") or "[]")
        ids = map(lambda x: x.get("service"), hierarchie)
        params = self.params.copy()
        params["where"] = (
            f'id in ({",".join(map(addQuotes, ids))}) and startswith(nom, "Ministère")'
        )
        url = f"{self.start_urls[0]}?{urlencode(params)}"
        yield scrapy.Request(url=url, callback=self.parse_ministères)

    def parse_ministères(self, response: TextResponse):
        json_response = response.json()
        ministères = json_response.get("results", [])
        for ministère in ministères:
            self.logger.info(f"Parsing ministère: {ministère.get('nom')}")
            hierarchie = json.loads(ministère.get("hierarchie", "[]") or "[]")
            ids = list(map(lambda x: x.get("service"), hierarchie))

            if len(ids) == 0:
                continue
            params = self.params.copy()
            params["where"] = (
                f'id in ({",".join(map(addQuotes, ids))}) and startswith(nom, "Cabinet")'
            )
            url = f"{self.start_urls[0]}?{urlencode(params)}"
            yield scrapy.Request(url=url, callback=self.parse_cabinets)

            # Ministres délégués
            if ministère.get("nom", "").startswith("Ministère"):
                params["where"] = (
                    f'id in ({",".join(map(addQuotes, ids))}) and startswith(nom, "Ministre")'
                )
                url = f"{self.start_urls[0]}?{urlencode(params)}"
                yield scrapy.Request(url=url, callback=self.parse_ministères)

    def parse_cabinets(self, response: TextResponse):
        json_response = response.json()
        cabinets = json_response.get("results", [])
        for cabinet in cabinets:
            self.logger.info(f"Parsing cabinet: {cabinet.get('nom')}")
            yield from self.parse_personne(cabinet)


# Directrices de cabinet d'un.e président-e de département
class Figure6bSpider(BaseAnnuaireSpider):
    name = "figure6b"

    where = 'type_organisme="Préfecture, sous-préfecture"'
    fonctions = ["Directeur de cabinet", "Directrice de cabinet"]

    zone_geographique_type = "préfecture"

    def getZoneGeographiqueLibelle(self, result: dict):
        return prefectures.get(result.get("code_insee_commune", ""), "")


# Directrices de cabinet d'un.e président-e de région
class Figure7bSpider(BaseAnnuaireSpider):
    name = "figure7b"

    noms_organismes = [
        "Collectivité de Corse",
        "Collectivité territoriale de Guyane",
        "Collectivité territoriale de Martinique",
    ]

    where = f'type_organisme="Collectivité locale" and (nom like "Conseil régional - " or nom in ({",".join(map(addQuotes, noms_organismes))}))'

    fonctions = [
        "Directeur de cabinet",
        "Directeur du cabinet",
        "Directrice de cabinet",
        "Directrice du cabinet",
        "Directeur général des services",
        "Directrice générale des services",
        "Directeur général des services (DGS)",
        "Directrice générale des services (DGS)",
    ]

    zone_geographique_type = "région"

    def getZoneGeographiqueLibelle(self, result: dict):
        return (
            result.get("nom", "")
            .replace("Conseil régional - ", "")
            .replace("Collectivité de Corse", "Corse")
        )


# Hautes juridictions
class Figure8Spider(BaseAnnuaireSpider):
    name = "figure8"

    organismes = {
        "Conseil constitutionnel": ["Président", "Présidente"],
        "Conseil d'État": ["Vice-président", "Vice-présidente"],
        "Cour de cassation": ["Premier président", "Première présidente"],
        "Cour de justice de la République": ["Président", "Présidente"],
        "Cour des comptes": ["Premier président", "Première présidente"],
    }

    where = f"nom in ({','.join(map(addQuotes, organismes))})"
    fonctions = ["Président", "Présidente", "Vice-président", "Vice-présidente"]

    zone_geographique_type = "haute juridiction"

    def getZoneGeographiqueLibelle(self, result: dict):
        return result.get("nom", "")

    def matchFonction(self, fonction: str, nom_organisme: str):
        if nom_organisme not in self.organismes:
            self.logger.warning(
                f"Organisme {nom_organisme} non trouvé dans la liste des organismes"
            )
            return False
        return fonction in self.organismes[nom_organisme]


# Préfets et préfètes
class Figure9Spider(BaseAnnuaireSpider):
    name = "figure9"

    where = 'type_organisme="Préfecture, sous-préfecture"'
    fonctions = ["Préfet", "Préfète"]

    zone_geographique_type = "préfecture"

    def getZoneGeographiqueLibelle(self, result: dict):
        return prefectures.get(result.get("code_insee_commune", ""), "")


# Figure partielle, voir Figure10Spider
class Figure10PaysSpider(BaseAnnuaireSpider):
    where = 'type_organisme="Ambassade ou mission diplomatique"'
    fonctions = ["Ambassadeur", "Ambassadrice"]
    zone_geographique_type = "pays"

    def getZoneGeographiqueLibelle(self, result: dict):
        return self.getAddresse(result).get("pays", "")


# Figure partielle, voir Figure10Spider
class Figure10OrganisationsSpider(BaseAnnuaireSpider):
    fonctions = [
        "Ambassadeur",
        "Ambassadrice",
        "Représentant permanent",
        "Représentante permanente",
    ]
    zone_geographique_type = "organisation internationale"
    organisations = [
        #  Représentation permanente de la France auprès de l'Organisation des Nations unies - New York
        "264698f7-fa26-4b11-86e6-18a55aab7f4b",
        #  Représentation permanente de la France auprès de l'Organisation météorologique mondiale - Genève
        "3f9197ef-65bc-4d7f-9116-0fa5fdd213aa",
        #  Délégation permanente de la France auprès de l'Organisation des Nations unies pour l'éducation, la science et la culture - Paris
        "5a417930-9e04-4b72-9ca1-ac12442d3a99",
        #  Représentation permanente de la France auprès de l'Organisation de coopération et de développement économiques - Paris
        "3febdfff-b888-4764-bae2-be79058a11ab",
        #  Représentation permanente de la France auprès de l'Office des Nations unies et des Organisations internationales - Vienne
        "7e983ada-c4ac-4d95-a45c-0a05b5c6a470",
        #  Représentation permanente de la France auprès de l'Organisation maritime internationale (OMI) - Londres
        "9b85d991-86b9-410f-bb8b-23f2c69b02cb",
        #  Représentation permanente de la France auprès du Conseil de l'Europe - Strasbourg
        "5994a151-7a35-4f77-95da-ba8ed17394af",
        #  Représentation permanente de la France auprès de l'Organisation pour l'interdiction des armes chimiques (OIAC) - La Haye
        "eb87d261-f431-49f6-bfb9-5b86c2b8b3e6",
        #  Représentation permanente de la France auprès de l'Organisation des Nations unies - Nairobi
        "2d56fbc6-a2d2-4e1f-b37b-5221ee2e16d9",
        #  Représentation permanente de la France auprès de l'Organisation de l'aviation civile internationale (OACI) - Montréal
        "86400472-30a4-47c0-9964-5e65be480150",
        #  Représentation de la France auprès de la Communauté du Pacifique - Nouméa
        "fc0c04ba-ff00-4929-95c0-2deae123a1b6",
        #  Représentation permanente de la France auprès de l'Organisation pour la sécurité et la coopération en Europe - Vienne
        "0b920c1b-6128-4c98-a5b4-1fb9a3d9204e",
        # Représentation permanente de la France auprès de la Conférence du désarmement - Genève
        "b519d1a0-2bfe-45e1-a363-51cfe4fbf2a4",
        # Représentation permanente de la France auprès de l'Office des Nations unies - Genève
        "48bafbe1-3db1-4a78-9c14-6ea0d3269b9d",
        # Représentation permanente de la France auprès des institutions des Nations unies pour l'alimentation et l'agriculture - Rome
        "4e6af2c0-863e-4b47-b033-075bbbc62398",
    ]
    where = f"id in ({','.join(map(addQuotes, organisations))})"

    def getZoneGeographiqueLibelle(self, result: dict):
        return self.getAddresse(result).get("pays", "")


# Ambassadeurs et Ambassadrices
class Figure10Spider(BaseAnnuaireSpider):
    name = "figure10"

    async def start(self):
        async for item in Figure10PaysSpider(self.name).start():
            yield item
        async for item in Figure10OrganisationsSpider(self.name).start():
            yield item


# Présidentes d'une haute autorité ou agence
class Figure11Spider(BaseAnnuaireSpider):
    name = "figure11"
    # on choisit d'ignorer les fonctions de "Directeur général" et "Directrice générale"
    # qui donnent des résultats moins précis
    fonctions = [
        "Président",
        "Présidente",
        "Président du conseil d'administration",
        "Présidente du conseil d'administration",
        "Président du collège",
        "Présidente du collège",
        "Président de l'ARCEP",
        "Présidente de l'ARCEP",
        "Gouverneur de la Banque de France",
        "Gouverneure de la Banque de France",
        "Médiateur national de l'énergie",
        "Médiatrice nationale de l'énergie",
        "Contrôleur général des lieux de privation de liberté",
        "Contrôleure générale des lieux de privation de liberté",
        "Défenseur des droits",
        "Défenseure des droits",
    ]

    types_organismes = [
        "Autorité publique indépendante",
        "Autorité administrative indépendante",
        "Haute autorité",
        "Agence publique",
    ]

    noms_organismes = [
        "Banque de France",
        "Agence française de développement",
    ]

    exclure_organismes = [
        "Arcom - Lille",
        "Arcom - Lyon",
        "Arcom - Nouvelle-Calédonie et Wallis-et-Futuna",
        "Arcom - Paris",
        "Commissions spécialisées",
        "Collège de l'Autorité de régulation de la communication audiovisuelle et numérique",
        "Collège de la commission de régulation de l'énergie",
    ]

    where = (
        f"("
        f"type_organisme in ({','.join(map(addQuotes, types_organismes))}) "
        f"or nom in ({','.join(map(addQuotes, noms_organismes))})"
        f") "
        f"and NOT (nom in ({','.join(map(addQuotes, exclure_organismes))}))"
    )

    zone_geographique_type = "haute autorité ou agence"

    def getZoneGeographiqueLibelle(self, result: dict):
        return result.get("nom", "")

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
        (
            "https://api-lannuaire.service-public.gouv.fr"
            "/api/explore/v2.1/catalog/datasets"
            "/api-lannuaire-administration/records"
        )
    ]

    def getUrl(self):
        params = self.params.copy()
        params["offset"] = self.current_offset
        params["where"] = self.where
        return f"{self.start_urls[0]}?{urlencode(params)}"

    async def start(self):
        yield scrapy.Request(url=self.getUrl(), callback=self.parse)

    async def parse(self, response: TextResponse, **kwargs):
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


# Membres du Gouvernement (Premier ministre, Ministres, Ministres délégués, Secrétaires d'État)
class Figure1aSpider(BaseAnnuaireSpider):
    name = "figure1a"

    where = 'nom="Gouvernement (Premier ministre et ministères)"'
    zone_geographique_type = "gouvernement"
    stop_at_one = False

    # TODO: cette implémentation de la gestion des doublons devrait-elle être généralisée ?
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # On crée un "registre" vide au lancement du spider pour mémoriser les noms qui évitera les doublons
        self.personnes_vues = set()

    def getZoneGeographiqueLibelle(self, result: dict):
        return result.get("nom", "")

    def matchFonction(self, fonction: str, nom_organisme: str):
        mots_cles = ["ministre", "secrétaire d'état"]
        return any(mot in fonction.lower() for mot in mots_cles)

    def parse_personne(self, result: dict):
        # On appelle la méthode de la classe mère pour faire le travail d'extraction
        for item in super().parse_personne(result):
            # L'item retourné est un dictionnaire (grâce à item.model_dump())
            nom_complet = item.get("personne_nom_complet")

            # Le filtre anti-doublon intervient ici :
            if nom_complet not in self.personnes_vues:
                self.personnes_vues.add(nom_complet)
                yield item
            else:
                self.logger.debug(f"Doublon ignoré (cumul de mandats) : {nom_complet}")

    def parse(self, response: TextResponse, **kwargs):
        json_response = response.json()
        results = json_response.get("results", [])

        if not results:
            return

        gouvernement = results[0]

        hierarchie = json.loads(gouvernement.get("hierarchie", "[]") or "[]")
        ids = list(map(lambda x: x.get("service"), hierarchie))

        if ids:
            params = self.params.copy()
            params["where"] = (
                f"id in ({','.join(map(addQuotes, ids))}) "
                f'and (nom="Premier ministre" or startswith(nom, "Ministère") '
                f'or startswith(nom, "Ministre") or startswith(nom, "Secrétaire"))'
            )
            url = f"{self.start_urls[0]}?{urlencode(params)}"
            yield scrapy.Request(url=url, callback=self.parse_ministres)

    def parse_ministres(self, response: TextResponse):
        json_response = response.json()
        entites_ministerielles = json_response.get("results", [])

        for entite in entites_ministerielles:
            self.logger.info(f"Extraction des membres pour : {entite.get('nom')}")

            # L'appel à self.parse_personne passera désormais par notre version filtrée !
            yield from self.parse_personne(entite)

            hierarchie = json.loads(entite.get("hierarchie", "[]") or "[]")
            ids = list(map(lambda x: x.get("service"), hierarchie))

            if ids:
                params = self.params.copy()
                params["where"] = (
                    f"id in ({','.join(map(addQuotes, ids))}) "
                    f'and (startswith(nom, "Ministre") or startswith(nom, "Secrétaire"))'
                )
                url = f"{self.start_urls[0]}?{urlencode(params)}"
                yield scrapy.Request(url=url, callback=self.parse_ministres)


# Ministres à la tête d'un ministère régalien (incluant le Premier ministre)
class Figure1bSpider(BaseAnnuaireSpider):
    name = "figure1b"

    where = 'nom="Gouvernement (Premier ministre et ministères)"'
    zone_geographique_type = "gouvernement"
    stop_at_one = False

    # Mots-clés pour les postes régaliens (incluant le Premier Ministre)
    mots_cles_regaliens = [
        "premier ministre",
        "intérieur",
        "justice",
        "garde des sceaux",
        "armées",
        "défense",
        "affaires étrangères",
        "économie",
        "finances",
    ]

    def getZoneGeographiqueLibelle(self, result: dict):
        return result.get("nom", "")

    def matchFonction(self, fonction: str, nom_organisme: str):
        fonction_lower = fonction.lower()
        return "ministre" in fonction_lower or "garde des sceaux" in fonction_lower

    def parse(self, response: TextResponse, **kwargs):
        json_response = response.json()
        results = json_response.get("results", [])

        if not results:
            return

        gouvernement = results[0]

        hierarchie = json.loads(gouvernement.get("hierarchie", "[]") or "[]")
        ids = list(map(lambda x: x.get("service"), hierarchie))

        if ids:
            params = self.params.copy()
            # Recherche dans les organisations cibles
            params["where"] = (
                f"id in ({','.join(map(addQuotes, ids))}) "
                f'and (nom="Premier ministre" or startswith(nom, "Ministère"))'
            )
            url = f"{self.start_urls[0]}?{urlencode(params)}"
            yield scrapy.Request(url=url, callback=self.parse_ministeres_regaliens)

    def parse_ministeres_regaliens(self, response: TextResponse):
        json_response = response.json()
        ministeres = json_response.get("results", [])

        for ministere in ministeres:
            nom_ministere = ministere.get("nom", "").lower()

            # Le filtre métier : est-ce le PM ou un ministère régalien ?
            est_regalien = any(mot in nom_ministere for mot in self.mots_cles_regaliens)

            if est_regalien:
                self.logger.info(
                    f"Ministère régalien / PM ciblé : {ministere.get('nom')}"
                )

                # On extrait la personne à la tête de cette entité
                yield from self.parse_personne(ministere)


# Membres du cabinet du président de la république
# NB: on utilise la hierarchie pour récupérer tous les pôles du cabinet
class Figure1cSpider(BaseAnnuaireSpider):
    name = "figure1c"

    where = 'nom="Cabinet du président de la République"'
    zone_geographique_type = ""
    stop_at_one = False

    def matchFonction(self, fonction: str, nom_organisme: str):
        return True

    async def parse(self, response: TextResponse, **kwargs):
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
# NB: on utilise la hiérarchie pour récupérer tous les pôles rattachés au cabinet
class Figure1dSpider(BaseAnnuaireSpider):
    name = "figure1d"

    where = 'nom="Cabinet du Premier ministre"'
    zone_geographique_type = ""
    stop_at_one = False

    def matchFonction(self, fonction: str, nom_organisme: str):
        # On prend toutes les fonctions au sein du cabinet et de ses pôles
        return True

    def getZoneGeographiqueLibelle(self, result: dict):
        # Récupère dynamiquement le nom de l'entité (ex: "Cabinet du Premier ministre"
        # ou "Pôle parlementaire", "Pôle diplomatique", etc.)
        return result.get("nom", "")

    async def parse(self, response: TextResponse, **kwargs):
        json_response = response.json()
        results = json_response.get("results", [])

        for result in results:
            # 1. On extrait d'abord les membres rattachés directement à l'entité principale ou au pôle
            for item in self.parse_personne(result):
                yield item

            # 2. On inspecte la hiérarchie pour trouver d'éventuels sous-services (les pôles)
            hierarchie = json.loads(result.get("hierarchie", "[]") or "[]")

            if len(hierarchie) == 0:
                continue

            # 3. On extrait les identifiants de ces sous-entités
            ids = map(lambda x: x.get("service"), hierarchie)

            # 4. On prépare une nouvelle requête pour aller chercher le contenu de ces identifiants
            params = self.params.copy()
            params["where"] = f"id in ({','.join(map(addQuotes, ids))})"
            url = f"{self.start_urls[0]}?{urlencode(params)}"

            yield scrapy.Request(
                url=url,
                # On boucle sur la même méthode parse pour extraire les personnes de ces pôles
                callback=self.parse,
            )


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

    def parse(self, response: TextResponse, **kwargs):
        json_response = response.json()
        gouvernement = json_response.get("results", [])[0]

        hierarchie = json.loads(gouvernement.get("hierarchie", "[]") or "[]")
        ids = map(lambda x: x.get("service"), hierarchie)
        params = self.params.copy()
        params["where"] = (
            f'id in ({",".join(map(addQuotes, ids))}) and startswith(nom, "Ministère")'
        )
        url = f"{self.start_urls[0]}?{urlencode(params)}"
        yield scrapy.Request(url=url, callback=self.parse_ministeres)

    def parse_ministeres(self, response: TextResponse):
        json_response = response.json()
        ministeres = json_response.get("results", [])
        for ministere in ministeres:
            self.logger.info(f"Parsing ministère: {ministere.get('nom')}")
            hierarchie = json.loads(ministere.get("hierarchie", "[]") or "[]")
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
            if ministere.get("nom", "").startswith("Ministère"):
                params["where"] = (
                    f'id in ({",".join(map(addQuotes, ids))}) and startswith(nom, "Ministre")'
                )
                url = f"{self.start_urls[0]}?{urlencode(params)}"
                yield scrapy.Request(url=url, callback=self.parse_ministeres)

    def parse_cabinets(self, response: TextResponse):
        json_response = response.json()
        cabinets = json_response.get("results", [])
        for cabinet in cabinets:
            self.logger.info(f"Parsing cabinet: {cabinet.get('nom')}")
            yield from self.parse_personne(cabinet)


# Toutes les personnes rattachées à un Conseil départemental, avec lien vers l'organigramme
# Nous n'avons pas trouvé de moyen efficace pour extraire les directeurs de cabinet et les DGS à partir
# des données fournies par l'API. On ajoute cependant l'URL de l'organigramme pour chaque conseil départemental.
class Figure6bSpider(BaseAnnuaireSpider):
    name = "figure6b"

    where = 'type_organisme="Collectivité locale" and startswith(nom, "Conseil départemental")'
    zone_geographique_type = "département"
    stop_at_one = False

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # On copie les paramètres de base pour ne pas polluer les autres spiders
        self.params = super().params.copy()
        # On AJOUTE 'organigramme' à la liste des champs demandés à l'API !
        self.params["select"] += ",organigramme"

    def matchFonction(self, fonction: str, nom_organisme: str):
        # On prend tout le monde
        return True

    def getZoneGeographiqueLibelle(self, result: dict):
        return result.get("nom", "").replace("Conseil départemental - ", "").strip()

    def parse_personne(self, result: dict):
        # 1. Extraction sécurisée de l'URL de l'organigramme
        # On utilise le 'or "[]"' que tu connais bien maintenant !
        orga_data = json.loads(result.get("organigramme", "[]") or "[]")

        url_organigramme = ""
        if len(orga_data) > 0:
            # On récupère la valeur de la clé 'valeur' dans le premier élément de la liste
            url_organigramme = orga_data[0].get("valeur", "")

        # 2. On fait tourner la mécanique de base pour extraire les personnes
        for item in super().parse_personne(result):
            # L'item est un dictionnaire, on lui ajoute simplement notre nouvelle colonne
            item["url_organigramme"] = url_organigramme

            yield item


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
    # Il faudrait creuser les désignations des représentants de l'État dans les territoires d'Outre-mer,
    # qui varient selon les territoires. Et ne sont peut-être pas très stables dans le temps !
    fonctions = [
        "Préfet",
        "Préfète",
        "Préfet de région",
        "Préfète de région",
        "Préfet délégué",
        "Préfète déléguée",
        "Représentant de l'État",
        "Représentante de l'État",
        "Haut-commissaire de la République",
        "Haut-commissaire de la République, haut fonctionnaire de zone de défense et de sécurité Nouvelle-Calédonie",
        "Préfet de la région Guyane, préfet de la Guyane",
    ]

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

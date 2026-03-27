import json
from io import BytesIO
from types import SimpleNamespace
import zipfile

import requests
import scrapy
import scrapy.http
import scrapy.http.response

from ..models import Personne
import re


class BaseAssembleeSpider(scrapy.Spider):
    # Type d'organe à extraire des mandats du député, à définir dans les classes filles
    typeOrgane: str = ""
    # Noms des qualités (ou fonctions) à extraire des mandats du député, à définir dans les classes filles
    qualites: list[str] = []

    organes: dict[str, str] = {}
    zipFile: zipfile.ZipFile

    async def start(self):
        # On utilise Wikidata pour trouver le numéro de l'assemblée en cours, afin de construire l'URL du fichier à télécharger sur le site de l'Assemblée Nationale.
        # En effet, ce numéro change à chaque législature, et l'API de l'Assemblée Nationale ne permet pas de le récupérer facilement.
        sparql_query_wikidata = """
        SELECT ?ordinal WHERE {
            SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }

            ?item wdt:P31 wd:Q15238777 ; # instance of  = legislative term
                    wdt:P17 wd:Q142 ; # country = france
                    wdt:P13188 wd:Q193582. # meeting of  = national assembly 

            FILTER NOT EXISTS { ?item wdt:P582 ?endTime . } # end time is not set

            # select the "series ordinal" = # of the assembly
            ?item p:P31 ?statement .
            ?statement pq:P1545 ?ordinal .
        }
        """
        params = {"query": sparql_query_wikidata, "format": "json"}
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(
            url="https://query.wikidata.org/sparql", params=params, headers=headers
        )
        data = response.json()
        ordinal = data["results"]["bindings"][0]["ordinal"]["value"]
        yield scrapy.Request(
            url=f"https://data.assemblee-nationale.fr/static/openData/repository/{ordinal}/amo/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes.json.zip",
            callback=self.parse,
        )

    def parse(self, response: scrapy.http.response.Response):
        self.zipFile = zipfile.ZipFile(BytesIO(response.body))
        for file in self.zipFile.filelist:
            if not re.match(r"^json/acteur/.*\.json$", file.filename):
                self.logger.debug(f"Skipping file: {file.filename}")
                continue
            self.logger.info(f"Parsing file: {file.filename}")
            yield from self.parse_acteur(file.filename)

    def parse_organe(self, id: str):
        if id in self.organes:
            return self.organes[id]

        data = self.zipFile.open(f"json/organe/{id}.json").read()
        parsed = json.loads(data, object_hook=lambda d: SimpleNamespace(**d))
        self.organes[id] = parsed.organe.libelle
        return parsed.organe.libelle

    def parse_acteur(self, path: str):
        data = self.zipFile.open(path).read()
        parsed = json.loads(data, object_hook=lambda d: SimpleNamespace(**d))
        acteur = parsed.acteur

        civilite = acteur.etatCivil.ident.civ
        nom = acteur.etatCivil.ident.nom
        prenom = acteur.etatCivil.ident.prenom

        groupe_politique_libelle = ""
        poste_libelle = ""

        circo_departement = None
        circo_departement_num = None
        circo_region = None
        circo_num = None

        for mandat in acteur.mandats.mandat:
            if mandat.dateDebut and mandat.dateFin is None:
                if (
                    mandat.typeOrgane == self.typeOrgane
                    and mandat.infosQualite
                    and mandat.infosQualite.codeQualite.encode("utf-8").decode("utf-8")
                    in self.qualites
                ):
                    organe = self.parse_organe(mandat.organes.organeRef)
                    poste_libelle = organe
                if mandat.typeOrgane == "GP":
                    organe = self.parse_organe(mandat.organes.organeRef)
                    groupe_politique_libelle = organe
                if mandat.typeOrgane == "ASSEMBLEE":
                    circo_region = mandat.election.lieu.region
                    circo_departement = mandat.election.lieu.departement
                    circo_departement_num = (mandat.election.lieu.numDepartement).zfill(
                        2
                    )
                    circo_num = (mandat.election.lieu.numCirco).zfill(2)

        if poste_libelle:
            yield Personne(
                personne_raw_text=f"{civilite} {prenom} {nom}",
                groupe_politique_libelle=groupe_politique_libelle,
                poste_libelle=poste_libelle,
                zone_geographique_type="circonscription",
                zone_geographique_libelle=f"{circo_region} - {circo_departement} ({circo_departement_num}) - {circo_num}",
            )


# Les député·e·s
class Figure2aSpider(BaseAssembleeSpider):
    name = "figure2a"
    typeOrgane = "ASSEMBLEE"
    qualites = ["membre"]


class Figure2bSpider(BaseAssembleeSpider):
    name = "figure2b"
    # COMPER = Commission Permanente
    typeOrgane = "COMPER"
    qualites = ["Président"]


# Le bureau de l'Assemblée Nationale
class Figure2cSpider(BaseAssembleeSpider):
    name = "figure2c"
    typeOrgane = "BUREAU"
    qualites = ["Président", "Vice-Président", "Questeur", "Secrétaire"]


class Figure2dSpider(BaseAssembleeSpider):
    name = "figure2d"
    # GP = Groupe Politique
    typeOrgane = "GP"
    qualites = ["Président"]

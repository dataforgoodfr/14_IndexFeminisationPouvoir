import json
from io import BytesIO
from types import SimpleNamespace
import zipfile

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

    start_urls = [
        "https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes.json.zip"
    ]

    organes: dict[str, str] = {}
    zipFile: zipfile.ZipFile

    async def parse(self, response: scrapy.http.response.Response):
        self.zipFile = zipfile.ZipFile(BytesIO(response.body))
        for file in self.zipFile.filelist:
            if not re.match(r"^json/acteur/.*\.json$", file.filename):
                self.logger.debug(f"Skipping file: {file.filename}")
                continue
            self.logger.info(f"Parsing file: {file.filename}")
            async for item in self.parse_acteur(file.filename):
                yield item

    def parse_organe(self, id: str):
        if id in self.organes:
            return self.organes[id]

        data = self.zipFile.open(f"json/organe/{id}.json").read()
        parsed = json.loads(data, object_hook=SimpleNamespace)
        self.organes[id] = parsed.organe.libelle
        return parsed.organe.libelle

    async def parse_acteur(self, path: str):
        data = self.zipFile.open(path).read()
        parsed = json.loads(data, object_hook=SimpleNamespace)
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


# TODO doublon avec figure2a, mais basée sur la donnée offcielle de l'AN.
# plusieurs écarts observés, la donnée AN a l'air plus à jour
class Figure2abisSpider(BaseAssembleeSpider):
    name = "figure2abis"
    typeOrgane = "ASSEMBLEE"
    qualites = ["membre"]


class Figure2bSpider(BaseAssembleeSpider):
    name = "figure2b"
    # COMPER = Commission Permanente
    typeOrgane = "COMPER"
    qualites = ["Président"]


# TODO doublon avec figure2b, mais sans scrapping html
class Figure2cbisSpider(BaseAssembleeSpider):
    name = "figure2cbis"
    typeOrgane = "BUREAU"
    qualites = ["Président", "Vice-Président", "Questeur", "Secrétaire"]


class Figure2dSpider(BaseAssembleeSpider):
    name = "figure2d"
    # GP = Groupe Politique
    typeOrgane = "GP"
    qualites = ["Président"]

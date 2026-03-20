import io
import json
import subprocess
import sys
import tempfile
from pathlib import Path
import zipfile

import pytest
from scrapy.http import HtmlResponse, Request
from scrapers.scrapers_ifp.scrapers_ifp.models import Personne

# Import de votre spider. Adaptez le chemin selon l'arborescence de votre projet.
# Par exemple : from scrapers_ifp.spiders.figure2c_spider import Figure2cSpider
from scrapers.scrapers_ifp.scrapers_ifp.spiders.figure2c_spider import Figure2cSpider
from scrapers.scrapers_ifp.scrapers_ifp.spiders.assemblee_spider import Figure2bSpider

# On définit les chemins
TEST_DIR = Path(__file__).parent
DATA_DIR = TEST_DIR / "data"


@pytest.mark.asyncio
async def test_spider_figure2c_extrait_yael_braun_pivet():
    """Teste que le spider parse correctement le fichier HTML local de l'Assemblée."""

    # 1. On charge le fichier HTML local (en bytes, comme le fait Scrapy)
    fichier_html = DATA_DIR / "figure2c.html"
    if not fichier_html.exists():
        pytest.skip(f"Fichier introuvable: {fichier_html}")

    contenu_html = fichier_html.read_bytes()

    # 2. On simule la réponse de Scrapy
    request = Request(url="https://www2.assemblee-nationale.fr/dummy-url")
    response = HtmlResponse(
        url=request.url, request=request, body=contenu_html, encoding="utf-8"
    )

    # 3. On instancie le spider
    spider = Figure2cSpider()

    # 4. On exécute la méthode parse et on récolte les résultats (les dictionnaires model_dump).
    resultats = []
    async for item in spider.parse(response):
        resultats.append(item)

        # 5. Les vérifications (Assertions)
        assert len(resultats) > 0, (
            "Le spider n'a extrait aucune donnée ou requête de la page."
        )

        yael_trouvee = False

        for element in resultats:
            personne_dict = {}

            # Cas A : Le spider a trouvé un lien et généré une requête
            if isinstance(element, Request):
                identite_brute = element.meta.get("identite_brute", "")
                # On passe le texte brut dans notre modèle Pydantic pour parser le nom
                personne_dict = Personne(personne_raw_text=identite_brute).model_dump()

            # Cas B : Le spider n'a pas trouvé de lien et a renvoyé le dictionnaire direct
            elif isinstance(element, dict):
                personne_dict = element

            # On fait notre vérification sur le dictionnaire final
            if (
                personne_dict.get("personne_nom") == "Braun-Pivet"
                and personne_dict.get("personne_prenom") == "Yaël"
            ):
                yael_trouvee = True
                break

        assert yael_trouvee, "La présidente Yaël Braun-Pivet n'a pas été trouvée."


# 1. On calcule le chemin vers la racine du projet (le dossier parent de 'tests').
TEST_DIR = Path(__file__).parent
PROJECT_ROOT = TEST_DIR.parent

# Le dossier qui contient 'scrapy.cfg'
scrapy_project_dir = PROJECT_ROOT / "scrapers_ifp"


@pytest.mark.live
def test_spider_figure2c_live_e2e():
    """
    Test d'intégration E2E : Lance le vrai spider sur le vrai site web
    via Playwright et vérifie les résultats extraits.
    """

    with tempfile.NamedTemporaryFile(suffix=".jl", delete=False) as tmp:
        fichier_resultat = tmp.name

    try:
        commande = [
            sys.executable,
            "-m",
            "scrapy",
            "crawl",
            "figure2c",
            "-O",
            fichier_resultat,
        ]

        resultat_commande = subprocess.run(
            commande,
            capture_output=True,
            text=True,
            cwd=scrapy_project_dir,  # <--- On passe le dossier exact qui contient scrapy.cfg
        )

        assert resultat_commande.returncode == 0, (
            f"Le spider a crashé.\nSTDOUT: {resultat_commande.stdout}\nSTDERR: {resultat_commande.stderr}"
        )

        donnees_extraites = []
        with open(fichier_resultat, "r", encoding="utf-8") as f:
            for ligne in f:
                if ligne.strip():
                    donnees_extraites.append(json.loads(ligne))

        # Les Assertions
        assert len(donnees_extraites) >= 10, (
            f"Seulement {len(donnees_extraites)} personnes trouvées."
        )

        yael_trouvee = any(
            p.get("personne_nom") == "Braun-Pivet"
            and p.get("personne_prenom") == "Yaël"
            for p in donnees_extraites
        )
        assert yael_trouvee, "La présidente Yaël Braun-Pivet n'a pas été trouvée."

        for personne in donnees_extraites:
            assert personne.get("personne_genre") in [
                "M",
                "F",
                "U",
            ], "Un genre invalide a été généré."

    finally:
        Path(fichier_resultat).unlink(missing_ok=True)


def loadZip(name: str):
    figure_2b_dir = DATA_DIR / name
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path in sorted(figure_2b_dir.rglob("*")):
            if file_path.is_file():
                arcname = file_path.relative_to(figure_2b_dir)
                zf.write(file_path, arcname)
    zip_buffer.seek(0)

    return zip_buffer.read()


def test_spider_figure2b():
    spider = Figure2bSpider()

    # 1. On génère un fichier zip en mémoire à partir du dossier de test "figure_2b" qui contient les fichiers JSON d'exemple.
    content_zip = loadZip("assemblee_nationale")

    # 2. On simule la réponse de Scrapy
    request = Request(url="https://data.assemblee-nationale.fr/dummy-url.zip")
    response = HtmlResponse(
        url=request.url, request=request, body=content_zip, encoding="utf-8"
    )

    # 3. On exécute le spider
    resultats = list(spider.parse(response))        

    result_dump = resultats[0].model_dump()

    # 4. On vérifie les résultats extraits
    expected = Personne(
        personne_raw_text="M. Alexandre Portier",
        groupe_politique_libelle="Droite Républicaine",
        poste_libelle="Commission des affaires culturelles et de l'éducation",
        zone_geographique_libelle="Auvergne-Rhône-Alpes - Rhône (69) - 09",
        zone_geographique_type="circonscription",
    )

    assert len(resultats) == 1, (
        f"Le spider a extrait {len(resultats)} personnes au lieu de 1."
    )
    assert isinstance(resultats[0], Personne), (
        f"Le spider a extrait un objet de type {type(resultats[0])} au lieu de Personne."
    )

    expected_dump = expected.model_dump()
    assert result_dump == expected_dump, "Résultat incorrect."

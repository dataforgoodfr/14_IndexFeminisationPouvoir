import io
from pathlib import Path
import zipfile

from scrapy.http import HtmlResponse, Request
from ..scrapers_ifp.models import Personne
from ..scrapers_ifp.spiders.assemblee_spider import Figure2bSpider

# On définit les chemins
TEST_DIR = Path(__file__).parent
DATA_DIR = TEST_DIR / "data"


# 1. On calcule le chemin vers la racine du projet (le dossier parent de 'tests').
TEST_DIR = Path(__file__).parent
PROJECT_ROOT = TEST_DIR.parent

# Le dossier qui contient 'scrapy.cfg'
scrapy_project_dir = PROJECT_ROOT


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

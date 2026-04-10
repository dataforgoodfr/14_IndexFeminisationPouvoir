import io
import os
from pathlib import Path
import zipfile

from scrapy.http import HtmlResponse, Request
from scrapers.scrapers_ifp.models import Personne

from scrapers.scrapers_ifp.spiders.assemblee_spider import Figure2bSpider

# On définit les chemins
TEST_DIR = Path(__file__).parent
DATA_DIR = TEST_DIR / "data"
PROJECT_ROOT = TEST_DIR.parent
scrapy_project_dir = (PROJECT_ROOT / "scrapers_ifp").resolve()


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


def test_spider_list():
    """Valide la liste de l'ensemble des spiders en utilisant les settings Scrapy."""
    # On se déplace dans le répertoire du projet Scrapy pour être cohérent avec l'environnement réel
    original_cwd = os.getcwd()
    os.chdir(scrapy_project_dir)

    from scrapy.settings import Settings
    from scrapy.spiderloader import SpiderLoader

    try:
        # On charge les settings manuellement via le chemin de module complet
        # qui est stable et accessible dans l'environnement de test (local et Docker).
        from scrapers.scrapers_ifp import settings as scrapy_settings_mod

        settings = Settings()
        settings.setmodule(scrapy_settings_mod, priority="project")

        # On force SPIDER_MODULES pour utiliser le chemin complet de module.
        # Cela évite les ModuleNotFoundError sur 'scrapers_tmp.spiders' car Scrapy
        # utilisera le chemin absolu 'scrapers.scrapers_tmp.spiders'.
        settings.set(
            "SPIDER_MODULES",
            ["scrapers.scrapers_ifp.spiders"],
            priority="cmdline",
        )

        spider_loader = SpiderLoader.from_settings(settings)
        spiders = sorted(spider_loader.list())
    finally:
        os.chdir(original_cwd)

    expected_spiders = sorted(
        [
            "figure10",
            "figure11",
            "figure1a",
            "figure1b",
            "figure1c",
            "figure1d",
            "figure1e",
            "figure2a",
            "figure2b",
            "figure2c",
            "figure2d",
            "figure3a",
            "figure3b",
            "figure3c",
            "figure3d",
            "figure4",
            "figure5a",
            "figure5b",
            "figure6a",
            "figure6b",
            "figure7a",
            "figure7b",
            "figure8",
            "figure9",
        ]
    )

    assert spiders == expected_spiders, (
        f"La liste des spiders est incorrecte. \nAttendus : {expected_spiders}\nObtenus : {spiders}"
    )

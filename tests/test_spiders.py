import json
import subprocess
import sys
import tempfile
from pathlib import Path

import pytest
from scrapy.http import HtmlResponse, Request

# Import de votre spider. Adaptez le chemin selon l'arborescence de votre projet.
# Par exemple : from scrapers_ifp.spiders.figure2c_spider import Figure2cSpider
from scrapers_ifp.scrapers_ifp.spiders.figure2c_spider import Figure2cSpider

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
        url=request.url,
        request=request,
        body=contenu_html,
        encoding='utf-8'
    )

    # 3. On instancie le spider
    spider = Figure2cSpider()

    # 4. On exécute la méthode parse et on récolte les résultats (les dictionnaires model_dump).
    resultats = []
    async for item in spider.parse(response):
        resultats.append(item)

    # 5. Les vérifications (Assertions)
    # Vérifie qu'on a bien extrait des personnes (la liste n'est pas vide).
    assert len(resultats) > 0, "Le spider n'a extrait aucune donnée de la page."

    # On cherche Yaël Braun-Pivet dans la liste extraite
    yael_trouvee = False

    for personne in resultats:
        # On se base sur le dictionnaire généré par item.model_dump()
        if personne.get("personne_nom") == "Braun-Pivet" and personne.get("personne_prenom") == "Yaël":
            yael_trouvee = True

            # On vérifie que votre modèle Pydantic a bien fait son travail dans le spider.
            assert personne["personne_genre"] == "F"
            # Selon le HTML exact de l'assemblée, ça peut être "Mme" ou "Madame".
            assert personne["personne_civilite"] in ["Mme", "Madame"]
            break

    # Si on parcourt toute la liste sans la trouver, le test échoue
    assert yael_trouvee, "Mme Yaël Braun-Pivet n'a pas été trouvée par le spider dans le fichier HTML."


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
        commande = [sys.executable, "-m", "scrapy", "crawl", "figure2c", "-O", fichier_resultat]

        resultat_commande = subprocess.run(
            commande,
            capture_output=True,
            text=True,
            cwd=scrapy_project_dir  # <--- On passe le dossier exact qui contient scrapy.cfg
        )

        assert resultat_commande.returncode == 0, f"Le spider a crashé.\nSTDOUT: {resultat_commande.stdout}\nSTDERR: {resultat_commande.stderr}"

        donnees_extraites = []
        with open(fichier_resultat, 'r', encoding='utf-8') as f:
            for ligne in f:
                if ligne.strip():
                    donnees_extraites.append(json.loads(ligne))

        # Les Assertions
        assert len(donnees_extraites) >= 10, f"Seulement {len(donnees_extraites)} personnes trouvées."

        yael_trouvee = any(
            p.get("personne_nom") == "Braun-Pivet" and p.get("personne_prenom") == "Yaël"
            for p in donnees_extraites
        )
        assert yael_trouvee, "La présidente Yaël Braun-Pivet n'a pas été trouvée."

        for personne in donnees_extraites:
            assert personne.get("personne_genre") in ["M", "F", "U"], "Un genre invalide a été généré."

    finally:
        Path(fichier_resultat).unlink(missing_ok=True)
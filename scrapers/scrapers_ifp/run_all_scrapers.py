"""
Lance tous les spiders du projet avec sauvegarde des fichiers CSV dans le dossier data
TODO: exporter les sorties dans S3, configurer le logging et refactorer la production des settings
"""
import argparse
import sys
from dotenv import load_dotenv
import os
import logging
from scrapy.utils.project import get_project_settings
from scrapy.crawler import AsyncCrawlerProcess
from scrapy.spiderloader import SpiderLoader
from scrapy.utils.log import configure_logging


def parse_arguments():
    """
    Gère les arguments de la ligne de commande et valide l'environnement.
    """

    parser = argparse.ArgumentParser(description="Orchestrateur de scrapers IFP.")
    parser.add_argument(
        "--target",
        choices=["local", "s3", "both"],
        default="local",
        help="Destination des exports (default: local)",
    )

    args = parser.parse_args()

    # Validation de sécurité pour S3
    if args.target in ["s3", "both"]:
        load_dotenv()
        required_keys = [
            "S3_ACCESS_KEY",
            "S3_SECRET_ACCESS_KEY",
            "S3_REGION",
            "S3_ENDPOINT_URL",
            "S3_BUCKET_NAME",
        ]
        missing = [key for key in required_keys if not os.getenv(key)]

        if missing:
            print(
                f"ERREUR : Cible '{args.target}' choisie, mais variables manquantes : {', '.join(missing)}"
            )
            print("Vérifiez votre fichier .env ou vos secrets GitHub.")
            sys.exit(1)  # Arrêt propre du script

    return args


def run_all():
    """
    Lance tous les spiders du projet avec sauvegarde des fichiers CSV dans le dossier data
    """
    settings = get_project_settings()

    configure_logging(settings)
    logger = logging.getLogger(__name__)

    data_dir = os.path.join(os.getcwd(), "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

    spider_loader = SpiderLoader.from_settings(settings)
    spiders = spider_loader.list()
    # spiders = ["figure2c"]
    process = AsyncCrawlerProcess(settings)

    for spider_name in spiders:
        # 1. On récupère la CLASSE du spider
        spider_cls = spider_loader.load(spider_name)

        # 2. On récupère les réglages déjà existants sur la classe (Playwright, etc.)
        # Si le spider n'en a pas, on part d'un dictionnaire vide
        existing_settings = getattr(spider_cls, "custom_settings", {}) or {}

        # 3. On prépare nos réglages de sortie
        new_feeds = {
            "FEEDS": {
                f"file://{data_dir}/%(name)s_%(time)s.csv": {
                    "format": "csv",
                }
            }
        }

        # 4. FUSION : On garde l'ancien et on ajoute le nouveau
        # .copy() évite de modifier accidentellement d'autres références
        updated_settings = existing_settings.copy()
        updated_settings.update(new_feeds)

        # 5. On réaffecte le dictionnaire complet à la classe
        spider_cls.custom_settings = updated_settings

        logger.info(f"Configuration fusionnée pour {spider_name} (Playwright préservé)")
        process.crawl(spider_cls)

    logger.info("🚀 Démarrage du processus Scrapy...")
    process.start()


if __name__ == "__main__":
    run_all()

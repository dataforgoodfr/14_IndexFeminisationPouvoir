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
from scrapers.scrapers_ifp.scrapers_ifp.constants import OUTPUT_DIR


def parse_arguments():
    """
    Parses command-line arguments and validates the configuration for exporting
    data either locally, to S3, or to both destinations.

    Raises an error if the storage includes 's3' or 'both' and any required
    environment variables specific to S3 are missing.

    Returns:
        An argparse.Namespace object containing the parsed arguments.
    """

    parser = argparse.ArgumentParser(description="Orchestrateur de scrapers IFP.")
    parser.add_argument(
        "--storage",
        choices=["local", "s3", "both"],
        default="local",
        help="Destination des exports (default: local)",
    )

    args = parser.parse_args()

    # Validation de sécurité pour S3
    if args.storage in ["s3", "both"]:
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
                f"ERREUR : Cible '{args.storage}' choisie, mais variables manquantes : {', '.join(missing)}"
            )
            print("Vérifiez votre fichier .env ou vos secrets GitHub.")
            sys.exit(1)  # Arrêt propre du script

    return args


def run_all():
    """
    Lance tous les spiders du projet avec sauvegarde des fichiers CSV dans le dossier data
    """
    args = parse_arguments()
    settings = get_project_settings()

    configure_logging(settings)
    logger = logging.getLogger(__name__)

    spider_loader = SpiderLoader.from_settings(settings)
    spiders = spider_loader.list()
    process = AsyncCrawlerProcess(settings)

    for spider_name in spiders:
        # 1. On récupère la CLASSE du spider
        spider_cls = spider_loader.load(spider_name)

        # 2. On récupère les réglages déjà existants sur la classe (Playwright, etc.)
        # Si le spider n'en a pas, on part d'un dictionnaire vide
        existing_settings = getattr(spider_cls, "custom_settings", {}) or {}

        # 3. On prépare nos réglages de sortie
        feeds = {}
        if args.storage in ["local", "both"]:
            feeds[f"file://{OUTPUT_DIR}/%(name)s_%(time)s.csv"] = {"format": "csv"}

        if args.storage in ["s3", "both"]:
            bucket = os.getenv("S3_BUCKET_NAME")
            s3_uri = f"s3://{bucket}/%(name)s_%(time)s.csv"
            feeds[s3_uri] = {"format": "csv"}

            # Configuration pour S3 (Scrapy utilise AWS_ACCESS_KEY_ID et AWS_SECRET_ACCESS_KEY par défaut)
            # Mais on peut aussi passer les variables d'environnement directement à Scrapy
            # ou via les settings.
            # Scrapy supporte AWS_ACCESS_KEY_ID et AWS_SECRET_ACCESS_KEY.
            # Pour l'endpoint S3 (ex: MinIO), on peut utiliser AWS_ENDPOINT_URL.
            os.environ["AWS_ACCESS_KEY_ID"] = os.getenv("S3_ACCESS_KEY")
            os.environ["AWS_SECRET_ACCESS_KEY"] = os.getenv("S3_SECRET_ACCESS_KEY")
            os.environ["AWS_ENDPOINT_URL"] = os.getenv("S3_ENDPOINT_URL")
            os.environ["AWS_REGION_NAME"] = os.getenv("S3_REGION")

        new_feeds = {"FEEDS": feeds}

        # 4. FUSION : On garde l'ancien et on ajoute le nouveau
        # .copy() évite de modifier accidentellement d'autres références
        updated_settings = existing_settings.copy()
        updated_settings.update(new_feeds)

        # 5. On réaffecte le dictionnaire complet à la classe
        spider_cls.custom_settings = updated_settings

        logger.info(
            f"Configuration fusionnée pour {spider_name} (Playwright préservé, storage: {args.storage})"
        )
        process.crawl(spider_cls)

    logger.info("🚀 Démarrage du processus Scrapy...")
    process.start()


if __name__ == "__main__":
    run_all()
